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

    // Get the user's workspace
    let [workspace] = await sql`
      SELECT id, name FROM workspaces WHERE owner_id = ${payload.id} LIMIT 1
    `;

    // Resilient fallback: Create a default workspace if none exists
    if (!workspace) {
      console.log(`No workspace found for user ${payload.id}, creating default...`);
      [workspace] = await sql.begin(async (tx: any) => {
        const [ws] = await tx`
          INSERT INTO workspaces (name, owner_id, role, team_size)
          VALUES ('My Workspace', ${payload.id}, 'Solo', 'Solo')
          RETURNING id, name
        `;
        
        // Also create a default project for this new workspace
        await tx`
          INSERT INTO projects (name, workspace_id)
          VALUES ('Getting started with Waterflow', ${ws.id})
        `;
        
        // Update user onboarded status
        await tx`
          UPDATE users SET onboarded = TRUE WHERE id = ${payload.id}
        `;
        
        return [ws];
      });
    }

    // Get projects for this workspace
    const projects = await sql`
      SELECT * FROM projects WHERE workspace_id = ${workspace.id} ORDER BY created_at DESC
    `;

    console.log(`Found ${projects.length} projects for workspace ${workspace.id}`);

    return NextResponse.json({ projects, workspace });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Get the user's workspace
    const [workspace] = await sql`
      SELECT id FROM workspaces WHERE owner_id = ${payload.id} LIMIT 1
    `;

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Create project
    const [project] = await sql`
      INSERT INTO projects (name, workspace_id)
      VALUES (${name}, ${workspace.id})
      RETURNING *
    `;

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
