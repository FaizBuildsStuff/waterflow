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

    // Get the user's workspace
    const [workspace] = await sql`
      SELECT id FROM workspaces WHERE owner_id = ${payload.id} LIMIT 1
    `;

    if (!workspace) {
      return NextResponse.json({ 
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0
      });
    }

    // Get all projects for this workspace
    const projectIds = (await sql`
      SELECT id FROM projects WHERE workspace_id = ${workspace.id}
    `).map(p => p.id);

    if (projectIds.length === 0) {
      return NextResponse.json({ 
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0
      });
    }

    // Fetch stats for all tasks in these projects
    const total = await sql`
      SELECT count(*) FROM tasks WHERE project_id IN (${projectIds})
    `;
    
    const completed = await sql`
      SELECT count(*) FROM tasks WHERE project_id IN (${projectIds}) AND status = 'Done'
    `;

    const inProgress = await sql`
      SELECT count(*) FROM tasks WHERE project_id IN (${projectIds}) AND status = 'In Progress'
    `;

    // Overdue tasks (placeholder logic: tasks with status 'Todo' or 'In Progress' and created more than 7 days ago if no due date)
    const overdue = await sql`
      SELECT count(*) FROM tasks 
      WHERE project_id IN (${projectIds}) 
      AND status != 'Done' 
      AND created_at < NOW() - INTERVAL '7 days'
    `;

    return NextResponse.json({ 
      total: parseInt(total[0].count),
      completed: parseInt(completed[0].count),
      inProgress: parseInt(inProgress[0].count),
      overdue: parseInt(overdue[0].count)
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
