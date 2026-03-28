import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idOrSlug } = await params;
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if it's an ID (numeric) or a slug
    const isId = /^\d+$/.test(idOrSlug);

    // Get the project and verify it belongs to user (owner or member)
    const [project] = await sql`
      SELECT p.* FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${payload.id}
      WHERE (
        ${isId ? sql`p.id = ${parseInt(idOrSlug)}` : sql`p.slug = ${idOrSlug}`}
      ) AND (w.owner_id = ${payload.id} OR pm.user_id = ${payload.id})
    `;

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
