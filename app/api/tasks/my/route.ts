import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get tasks assigned to the user or created by the user
    // Include project name for context
    const tasks = await sql`
      SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, t.assignee_id, t.project_id, t.created_at, t.blocked_by_ids, t.subtasks, p.name as project_name 
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN project_members pm ON p.id = pm.project_id
      WHERE (w.owner_id = ${payload.id} OR pm.user_id = ${payload.id})
      AND (t.assignee_id = ${payload.id} OR t.assignee_id IS NULL)
      ORDER BY t.created_at DESC
    `;

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('My tasks fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
