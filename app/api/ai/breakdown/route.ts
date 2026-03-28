import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';
import { checkAiUsage, incrementAiUsage } from '@/lib/usage';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check usage
    const usage = await checkAiUsage(payload.id);
    if (!usage.allowed) {
      return NextResponse.json({ error: usage.error }, { status: 403 });
    }

    const { goal, project_id } = await req.json();

    if (!goal || !project_id) {
      return NextResponse.json({ error: 'Goal and project_id are required' }, { status: 400 });
    }

    // Verify project ownership
    const [project] = await sql`
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE p.id = ${project_id} AND w.owner_id = ${payload.id}
    `;

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Call OpenAI
    const apiKey = process.env.CHATGPT_API;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a project management assistant. Break down the user\'s project goal into 5-8 concrete, actionable tasks. For each task, provide a title, a short description, and a priority (High, Medium, or Low). Return the result as a JSON array of objects with keys: title, description, priority.'
          },
          {
            role: 'user',
            content: `Break down this goal: "${goal}"`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const tasksRaw = JSON.parse(data.choices[0].message.content).tasks || JSON.parse(data.choices[0].message.content).task_list || Object.values(JSON.parse(data.choices[0].message.content))[0];
    
    // Ensure tasksRaw is an array
    const tasksToInsert = Array.isArray(tasksRaw) ? tasksRaw : [];

    // Insert tasks into DB
    const insertedTasks = [];
    for (const task of tasksToInsert) {
      const [inserted] = await sql`
        INSERT INTO tasks (title, description, priority, project_id, status)
        VALUES (${task.title}, ${task.description || ''}, ${task.priority || 'Medium'}, ${project_id}, 'Todo')
        RETURNING *
      `;
      insertedTasks.push(inserted);
    }

    // Increment usage
    await incrementAiUsage(payload.id);

    return NextResponse.json({ tasks: insertedTasks });
  } catch (error) {
    console.error('AI Breakdown error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
