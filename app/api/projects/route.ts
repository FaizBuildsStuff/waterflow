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
        const defaultProjectName = 'Getting started with Waterflow';
        const projectSlug = defaultProjectName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
        
        await tx`
          INSERT INTO projects (name, workspace_id, slug)
          VALUES (${defaultProjectName}, ${ws.id}, ${projectSlug})
        `;
        
        // Update user onboarded status
        await tx`
          UPDATE users SET onboarded = TRUE WHERE id = ${payload.id}
        `;
        
        return [ws];
      });
    }

    // Get projects for this workspace
    // Get workspace projects (owned)
    const ownedProjects = await sql`
      SELECT p.*, TRUE as is_owner FROM projects p
      WHERE p.workspace_id = ${workspace.id}
    `;

    // Get collaborated projects
    const collaboratedProjects = await sql`
      SELECT p.*, FALSE as is_owner FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = ${payload.id}
    `;

    // Combine or handle appropriately
    // For now, if we are in a specific workspace, we might only want to show projects associated with it
    // But the user wants invited projects to show up automatically.
    // If we're on the dashboard, we should show all relevant projects.
    
    console.log(`Found ${ownedProjects.length} owned projects and ${collaboratedProjects.length} collaborated projects for workspace ${workspace.id}`);

    return NextResponse.json({ 
      projects: [...ownedProjects, ...collaboratedProjects],
      workspace: workspace 
    });
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

    const { name, workspace_id: bodyWorkspaceId } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Get the user's workspace
    const cookieWorkspaceId = req.cookies.get('workspace_id')?.value;
    const targetWorkspaceId = bodyWorkspaceId || cookieWorkspaceId;

    const [workspace] = await sql`
      SELECT id FROM workspaces 
      WHERE owner_id = ${payload.id} 
      ${targetWorkspaceId ? sql`AND id = ${targetWorkspaceId}` : sql`LIMIT 1`}
    `;

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found or unauthorized' }, { status: 404 });
    }

    // Generate unique slug
    const baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const [existing] = await sql`SELECT count(*) FROM projects WHERE slug LIKE ${baseSlug + '%'}`;
    const slug = existing.count > 0 ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

    // Create project
    const [project] = await sql`
      INSERT INTO projects (name, workspace_id, slug, owner_id)
      VALUES (${name}, ${workspace.id}, ${slug}, ${payload.id})
      RETURNING *
    `;

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
