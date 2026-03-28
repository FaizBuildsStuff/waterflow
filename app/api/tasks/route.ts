import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

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

    const { title, project_id, status, priority, description, due_date, assignee_id } = await req.json();

    if (!title || !project_id) {
      return NextResponse.json({ error: 'Title and project_id are required' }, { status: 400 });
    }

    // Verify project ownership OR membership
    const [project] = await sql`
      SELECT p.id, w.owner_id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${payload.id}
      WHERE p.id = ${project_id} AND (w.owner_id = ${payload.id} OR pm.id IS NOT NULL)
    `;

    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Create task
    const [task] = await sql`
      INSERT INTO tasks (title, project_id, status, priority, description, due_date, assignee_id)
      VALUES (
        ${title}, 
        ${project_id}, 
        ${status || 'Todo'}, 
        ${priority || 'Medium'}, 
        ${description || ''}, 
        ${due_date || null}, 
        ${assignee_id || null}
      )
      RETURNING *
    `;

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id, status, title, description, priority, due_date, assignee_id, subtasks } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Verify task access
    const [taskCheck] = await sql`
      SELECT t.id, p.id as project_id, w.owner_id
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE t.id = ${id}
    `;

    if (!taskCheck) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const [member] = await sql`
      SELECT id FROM project_members 
      WHERE project_id = ${taskCheck.project_id} AND user_id = ${payload.id}
    `;

    if (taskCheck.owner_id !== payload.id && !member) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update task with proper NULL handling for COALESCE (if undefined is passed)
    // Actually, SQL template handles undefined -> null usually, but let's be safe
    // Update task with proper NULL handling for COALESCE (if undefined is passed)
    const [updatedTask] = await sql`
      UPDATE tasks SET
        status = ${status === undefined ? sql`status` : status},
        title = ${title === undefined ? sql`title` : title},
        description = ${description === undefined ? sql`description` : description},
        priority = ${priority === undefined ? sql`priority` : priority},
        due_date = ${due_date === undefined ? sql`due_date` : due_date},
        assignee_id = ${assignee_id === undefined ? sql`assignee_id` : assignee_id},
        subtasks = ${subtasks === undefined ? sql`subtasks` : subtasks}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // "My Tasks" - Get all tasks assigned to me or in projects I own
    const tasks = await sql`
      SELECT t.*, p.name as project_name, p.slug as project_slug
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${payload.id}
      WHERE t.assignee_id = ${payload.id} 
      OR w.owner_id = ${payload.id}
      ORDER BY t.created_at DESC
    `;

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
