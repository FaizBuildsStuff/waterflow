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
      SELECT 
        id, email, name, onboarded,
        subscription_tier as "subscriptionTier",
        subscription_status as "subscriptionStatus",
        trial_ends_at as "trialEndsAt",
        ai_usage_count as "aiUsageCount"
      FROM users WHERE id = ${payload.id}
    `;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Also get active workspace
    const workspaceId = req.cookies.get('workspace_id')?.value;
    let [workspace] = await sql`
      SELECT * FROM workspaces WHERE owner_id = ${user.id} 
      ${workspaceId ? sql`AND id = ${workspaceId}` : sql`LIMIT 1`}
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
        const defaultProjectName = 'Getting started with Anthryve';
        const projectSlug = defaultProjectName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
        
        await tx`
          INSERT INTO projects (name, workspace_id, slug, owner_id)
          VALUES (${defaultProjectName}, ${ws.id}, ${projectSlug}, ${user.id})
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
