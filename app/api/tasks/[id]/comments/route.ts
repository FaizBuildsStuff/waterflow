import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const { content } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify user has access to project
    const [task] = await sql`
      SELECT t.id, p.workspace_id, w.owner_id 
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE t.id = ${taskId}
    `;

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    // Check if owner or member
    const [member] = await sql`
      SELECT id FROM project_members 
      WHERE project_id = (SELECT project_id FROM tasks WHERE id = ${taskId}) 
      AND user_id = ${payload.id}
    `;

    if (task.owner_id !== payload.id && !member) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [comment] = await sql`
      INSERT INTO comments (task_id, user_id, content)
      VALUES (${taskId}, ${payload.id}, ${content})
      RETURNING *
    `;

    // Get user info for response
    const [user] = await sql`SELECT name, email FROM users WHERE id = ${payload.id}`;
    comment.user = user;

    return NextResponse.json({ comment });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const comments = await sql`
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.task_id = ${taskId}
      ORDER BY c.created_at ASC
    `;

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
