import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    const columns = await sql`
      SELECT c.* FROM kanban_columns c
      JOIN projects p ON c.project_id = p.id
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      )
      ORDER BY c.position ASC
    `;

    return NextResponse.json({ columns });
  } catch (error) {
    console.error('Fetch columns error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { title, color } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    const [project] = await sql`
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${payload.id}
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      ) AND (w.owner_id = ${payload.id} OR pm.role = 'admin')
    `;

    if (!project) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const [existing] = await sql`SELECT 1 FROM kanban_columns WHERE project_id = ${project.id} AND title = ${title}`;
    if (existing) return NextResponse.json({ error: 'Column already exists' }, { status: 400 });

    const [maxPos] = await sql`SELECT MAX(position) as pos FROM kanban_columns WHERE project_id = ${project.id}`;
    const nextPos = (maxPos.pos || 0) + 1;

    const [column] = await sql`
      INSERT INTO kanban_columns (project_id, title, color, position)
      VALUES (${project.id}, ${title}, ${color || 'bg-zinc-500'}, ${nextPos})
      RETURNING *
    `;

    return NextResponse.json({ column });
  } catch (error) {
    console.error('Create column error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { columnId } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    const [project] = await sql`
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      ) AND w.owner_id = ${payload.id}
    `;

    if (!project) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    await sql`DELETE FROM kanban_columns WHERE id = ${columnId} AND project_id = ${project.id}`;

    return NextResponse.json({ message: 'Column deleted successfully' });
  } catch (error) {
    console.error('Delete column error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
