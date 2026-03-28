import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get('token')?.value;

    const isIdNumeric = /^\d+$/.test(id);
    const [doc] = await sql`
      SELECT d.*, p.name as project_name 
      FROM docs d
      JOIN projects p ON d.project_id = p.id
      WHERE ${isIdNumeric ? sql`d.id = ${parseInt(id)}` : sql`d.slug = ${id}`}
    `;

    if (!doc) return NextResponse.json({ error: 'Doc not found' }, { status: 404 });

    // If private, check auth
    if (!doc.is_public) {
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const payload = await verifyToken(token);
      if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      
      // Check project access
      const [access] = await sql`
        SELECT 1 FROM projects p
        JOIN workspaces w ON p.workspace_id = w.id
        LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${payload.id}
        WHERE p.id = ${doc.project_id} AND (w.owner_id = ${payload.id} OR pm.user_id = ${payload.id})
      `;
      if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ doc });
  } catch (error) {
    console.error('Fetch doc error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { content, title, is_public } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [doc] = await sql`SELECT project_id FROM docs WHERE id = ${parseInt(id)}`;
    if (!doc) return NextResponse.json({ error: 'Doc not found' }, { status: 404 });

    // Check project access
    const [access] = await sql`
      SELECT 1 FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${payload.id}
      WHERE p.id = ${doc.project_id} AND (w.owner_id = ${payload.id} OR pm.role = 'admin' OR pm.role = 'owner')
    `;
    if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [updated] = await sql`
      UPDATE docs 
      SET 
        content = COALESCE(${content}, content),
        title = COALESCE(${title}, title),
        is_public = COALESCE(${is_public}, is_public),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    return NextResponse.json({ doc: updated });
  } catch (error) {
    console.error('Update doc error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
