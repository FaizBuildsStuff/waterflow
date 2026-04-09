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

    const members = await sql`
      WITH user_projects AS (
        SELECT project_id 
        FROM project_members 
        WHERE user_id = ${payload.id}
        UNION
        SELECT p.id 
        FROM projects p
        JOIN workspaces w ON p.workspace_id = w.id
        WHERE w.owner_id = ${payload.id}
      ),
      collaborators AS (
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.avatar_url,
          pm.role,
          pm.created_at as joined_at,
          p.name as project_name
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        JOIN projects p ON pm.project_id = p.id
        WHERE pm.project_id IN (SELECT project_id FROM user_projects)
        AND u.id != ${payload.id}
      )
      SELECT 
        id, name, email, avatar_url, role,
        MIN(joined_at) as joined_at,
        STRING_AGG(project_name, ', ') as project_name
      FROM collaborators
      GROUP BY id, name, email, avatar_url, role
      ORDER BY joined_at DESC
    `;

    return NextResponse.json({ members, invitations: [] });
  } catch (error) {
    console.error('Team fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
