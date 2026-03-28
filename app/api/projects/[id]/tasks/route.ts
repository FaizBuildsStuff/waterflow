import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if it's an ID (numeric) or a slug
    const isId = /^\d+$/.test(id);

    // Get tasks for project, verified by workspace ownership OR project membership
    const tasks = await sql`
      SELECT t.* FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${payload.id}
      WHERE (
        ${isId ? sql`t.project_id = ${parseInt(id)}` : sql`p.slug = ${id}`}
      ) AND (w.owner_id = ${payload.id} OR pm.user_id = ${payload.id})
      ORDER BY t.created_at ASC
    `;

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
