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
      SELECT u.id, u.name, u.email, u.avatar_url, pm.role, pr.name as custom_role_name, pr.color as custom_role_color, pr.id as role_id
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      JOIN projects p ON pm.project_id = p.id
      LEFT JOIN project_roles pr ON pm.role_id = pr.id
      WHERE (
        ${isId ? sql`pm.project_id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      )
    `;

    // Also include the owner
    const [owner] = await sql`
      SELECT u.id, u.name, u.email, u.avatar_url, 'owner' as role, null as custom_role_name, null as custom_role_color, null as role_id
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
    const { userId, role, roleId } = await req.json();
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

    // Role actions
    if (role === 'TRANSFER') {
      const [owner] = await sql`SELECT owner_id FROM projects WHERE id = ${project.id}`;
      if (owner.owner_id !== payload.id) {
        return NextResponse.json({ error: 'Only the current owner can transfer ownership' }, { status: 403 });
      }

      await sql`UPDATE projects SET owner_id = ${userId} WHERE id = ${project.id}`;
      await sql`INSERT INTO project_members (project_id, user_id, role) VALUES (${project.id}, ${payload.id}, 'member') ON CONFLICT (project_id, user_id) DO UPDATE SET role = 'member'`;
      await sql`DELETE FROM project_members WHERE project_id = ${project.id} AND user_id = ${userId}`;
      
      return NextResponse.json({ message: 'Ownership transferred successfully' });
    }

    if (role === 'CUSTOM') {
      await sql`
        UPDATE project_members 
        SET role = 'custom', role_id = ${roleId}
        WHERE project_id = ${project.id} AND user_id = ${userId}
      `;
      return NextResponse.json({ message: 'Custom role assigned successfully' });
    }

    // Standard role update (Admin/Member)
    await sql`
      UPDATE project_members 
      SET role = ${role}, role_id = NULL
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

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Allow removal if: 
    // 1. Current user is project owner
    // 2. Current user is removing themselves (stopping collaboration)
    if (project.owner_id !== payload.id && userId !== payload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await sql`DELETE FROM project_members WHERE project_id = ${project.id} AND user_id = ${userId}`;

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
