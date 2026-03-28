import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { email, role = 'member' } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    // Verify current user has access to share (owner of workspace)
    const [project] = await sql`
      SELECT p.* FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      ) AND w.owner_id = ${payload.id}
    `;

    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Find the user to invite
    const [userToInvite] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (!userToInvite) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add to project_members
    await sql`
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (${project.id}, ${userToInvite.id}, ${role})
      ON CONFLICT (project_id, user_id) DO NOTHING
    `;

    return NextResponse.json({ message: 'User invited successfully' });
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    // Get all members of the project
    const members = await sql`
      SELECT u.id, u.name, u.email, u.avatar_url, pm.role 
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      JOIN projects p ON pm.project_id = p.id
      WHERE (
        ${isId ? sql`pm.project_id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      )
    `;

    // Also include the owner
    const [owner] = await sql`
      SELECT u.id, u.name, u.email, u.avatar_url, 'owner' as role
      FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      JOIN users u ON w.owner_id = u.id
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      )
    `;

    return NextResponse.json({ members: owner ? [owner, ...members] : members });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { userId, role } = await req.json();
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
      )
    `;

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const [currentUserMember] = await sql`
      SELECT role FROM project_members WHERE project_id = ${project.id} AND user_id = ${payload.id}
    `;

    if (project.owner_id !== payload.id && currentUserMember?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update role
    await sql`
      UPDATE project_members 
      SET role = ${role} 
      WHERE project_id = ${project.id} AND user_id = ${userId}
    `;

    return NextResponse.json({ message: 'Role updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { userId } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    const [project] = await sql`
      SELECT p.id, w.owner_id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      )
    `;

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    if (project.owner_id !== payload.id) {
      return NextResponse.json({ error: 'Only owner can remove members' }, { status: 403 });
    }

    await sql`DELETE FROM project_members WHERE project_id = ${project.id} AND user_id = ${userId}`;

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
