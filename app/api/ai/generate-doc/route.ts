import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';
import OpenAI from 'openai';
import { checkAiUsage, incrementAiUsage } from '@/lib/usage';

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API,
});

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check usage
    const usage = await checkAiUsage(payload.id);
    if (!usage.allowed) {
      return NextResponse.json({ error: usage.error }, { status: 403 });
    }

    // Fetch project details
    const [project] = await sql`SELECT * FROM projects WHERE id = ${projectId} OR slug = ${projectId}`;
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Fetch tasks
    const tasks = await sql`SELECT * FROM tasks WHERE project_id = ${project.id}`;

    // Fetch members
    const members = await sql`
      SELECT u.name, u.email, pm.role 
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ${project.id}
      UNION
      SELECT u.name, u.email, 'owner' as role
      FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      JOIN users u ON w.owner_id = u.id
      WHERE p.id = ${project.id}
    `;

    // Process data for AI
    const projectSummary = `
      Project: ${project.name}
      Members: ${members.map(m => `${m.name} (${m.role})`).join(', ')}
      Total Tasks: ${tasks.length}
      Tasks: ${tasks.map(t => `- ${t.title} (${t.status}, Assigned to: ${t.assignee_id || 'Unassigned'})`).join('\n')}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI Project Manager. Your goal is to write a comprehensive, professional, and elegant project documentation in Markdown format, similar to a high-end Notion page. Include sections like Executive Summary, Team Overview, Task Progress, and Strategic Roadmap."
        },
        {
          role: "user",
          content: `Please generate a full documentation for the following project data:\n\n${projectSummary}`
        }
      ],
      temperature: 0.7,
    });

    const aiContent = response.choices[0].message.content;
    const randomHex = Math.random().toString(16).substring(2, 8);
    const docSlug = `${project.slug}-strategic-${randomHex}`;

    // Save to DB
    const [doc] = await sql`
      INSERT INTO docs (project_id, title, content, slug)
      VALUES (${project.id}, ${`${project.name} - Full Documentation`}, ${aiContent}, ${docSlug})
      RETURNING *
    `;

    // Increment usage
    await incrementAiUsage(payload.id);

    return NextResponse.json({ doc });
  } catch (error) {
    console.error('AI Doc Generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
