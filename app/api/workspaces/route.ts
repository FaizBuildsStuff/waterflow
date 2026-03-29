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

    // Get all workspaces where user is owner
    const workspaces = await sql`
      SELECT * FROM workspaces WHERE owner_id = ${payload.id} ORDER BY created_at DESC
    `;

    return NextResponse.json({ workspaces });
  } catch (error) {
    console.error('Workspaces fetch error:', error);
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

    // Check workspace limit for free tier
    const [user] = await sql`SELECT subscription_tier FROM users WHERE id = ${payload.id}`;
    const workspacesCount = await sql`SELECT count(*) FROM workspaces WHERE owner_id = ${payload.id}`;
    const count = parseInt(workspacesCount[0].count);

    if ((!user || user.subscription_tier === 'free') && count >= 1) {
      return NextResponse.json({ 
        error: 'Free tier is limited to 1 workspace. Upgrade to create more.',
        code: 'LIMIT_REACHED'
      }, { status: 403 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
    }

    // Create workspace
    const [workspace] = await sql`
      INSERT INTO workspaces (name, owner_id)
      VALUES (${name}, ${payload.id})
      RETURNING *
    `;

    return NextResponse.json({ workspace });
  } catch (error) {
    console.error('Workspace creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
