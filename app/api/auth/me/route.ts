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

    // Fetch user from DB to ensure they still exist and get latest data
    const [user] = await sql`
      SELECT id, email, name, onboarded FROM users WHERE id = ${payload.id}
    `;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Also get active workspace
    let [workspace] = await sql`
      SELECT * FROM workspaces WHERE owner_id = ${user.id} LIMIT 1
    `;

    // Resilient fallback: Create a default workspace if none exists
    if (!workspace) {
      console.log(`No workspace found for user ${user.id} in ME API, creating default...`);
      [workspace] = await sql.begin(async (tx: any) => {
        const [ws] = await tx`
          INSERT INTO workspaces (name, owner_id, role, team_size)
          VALUES ('My Workspace', ${user.id}, 'Solo', 'Solo')
          RETURNING *
        `;
        
        // Also create a default project for this new workspace
        await tx`
          INSERT INTO projects (name, workspace_id)
          VALUES ('Getting started with Waterflow', ${ws.id})
        `;
        
        // Update user onboarded status
        await tx`
          UPDATE users SET onboarded = TRUE WHERE id = ${user.id}
        `;
        
        return [ws];
      });
    }

    return NextResponse.json({ 
      user,
      workspace
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
