import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const docs = await sql`
      SELECT d.*, p.name as project_name 
      FROM docs d
      JOIN projects p ON d.project_id = p.id
      JOIN workspaces w ON p.workspace_id = w.id
      LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ${payload.id}
      WHERE w.owner_id = ${payload.id} OR pm.user_id = ${payload.id}
      ORDER BY d.updated_at DESC
    `;

    return NextResponse.json({ docs });
  } catch (error) {
    console.error('Fetch docs error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
