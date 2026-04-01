import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import sql from "@/lib/db";

// GET all roles for a project
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    // Get roles for this project
    const roles = await sql`
      SELECT pr.* FROM project_roles pr
      JOIN projects p ON pr.project_id = p.id
      WHERE (
        ${isId ? sql`pr.project_id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      )
      ORDER BY pr.created_at ASC
    `;

    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Roles fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST create a new role for a project
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const { name, color } = await req.json();
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isId = /^\d+$/.test(projectId);

    // Verify current user is owner/admin of the project
    const [project] = await sql`
      SELECT p.id, w.owner_id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE (
        ${isId ? sql`p.id = ${parseInt(projectId)}` : sql`p.slug = ${projectId}`}
      )
    `;

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const [currentUserMember] = await sql`
      SELECT role FROM project_members WHERE project_id = ${project.id} AND user_id = ${payload.id}
    `;

    if (project.owner_id !== payload.id && currentUserMember?.role !== "admin") {
      return NextResponse.json({ error: "Only owners or admins can create roles" }, { status: 403 });
    }

    // Create role
    const [role] = await sql`
      INSERT INTO project_roles (project_id, name, color)
      VALUES (${project.id}, ${name}, ${color || "#1a7fe0"})
      RETURNING *
    `;

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Role creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
