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

    // Get members of projects owned by the user
    const members = await sql`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        pm.role, 
        pm.created_at as joined_at,
        p.name as project_name
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      JOIN projects p ON pm.project_id = p.id
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.owner_id = ${payload.id}
      ORDER BY pm.created_at DESC
    `;

    return NextResponse.json({ members, invitations: [] });
  } catch (error) {
    console.error('Team fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
