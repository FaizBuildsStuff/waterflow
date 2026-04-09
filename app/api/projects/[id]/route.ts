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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    // Verify current user is the owner of the workspace the project belongs to
    const [project] = await sql`
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = projectId`}
      ) AND w.owner_id = ${payload.id}
    `;

    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Delete the project (assuming ON DELETE CASCADE for members and tasks)
    await sql`DELETE FROM projects WHERE id = ${project.id}`;

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Project deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { name } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    // Verify current user is owner of the workspace or admin of the project
    const [project] = await sql`
      SELECT p.id, w.owner_id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      ) AND w.owner_id = ${payload.id}
    `;

    if (!project) return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });

    // Update project
    const [updatedProject] = await sql`
      UPDATE projects SET name = ${name} WHERE id = ${project.id} RETURNING *
    `;

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
