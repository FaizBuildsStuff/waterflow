import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, signToken } from '@/lib/auth';
import sql from '@/lib/db';

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

    const { workspaceName, role, teamSize } = await req.json();

    if (!workspaceName || !role || !teamSize) {
      return NextResponse.json({ error: 'Missing required onboarding data' }, { status: 400 });
    }

    // Use a transaction to ensure atomicity
    await sql.begin(async (tx: any) => {
      // 1. Create Workspace
      const [workspace] = await tx`
        INSERT INTO workspaces (name, owner_id, role, team_size)
        VALUES (${workspaceName}, ${payload.id}, ${role}, ${teamSize})
        RETURNING id
      `;

      // 2. Create Default Project (Optional, but recommended for new users)
      await tx`
        INSERT INTO projects (name, workspace_id)
        VALUES ('Getting started with Waterflow', ${workspace.id})
      `;

      // 3. Update User onboarded status
      await tx`
        UPDATE users SET onboarded = TRUE WHERE id = ${payload.id}
      `;
    });

    // 4. Sign a new token with updated onboarded status
    const newToken = await signToken({
      id: payload.id,
      email: payload.email,
      name: payload.name,
      onboarded: true
    });

    const response = NextResponse.json({ message: 'Onboarding complete' });
    
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
