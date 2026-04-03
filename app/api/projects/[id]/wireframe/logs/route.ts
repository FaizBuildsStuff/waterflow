import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import sql from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSlug } = await params
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const isId = /^\d+$/.test(idOrSlug)

    const [project] = await sql`
      SELECT id FROM projects 
      WHERE ${isId ? sql`id = ${parseInt(idOrSlug)}` : sql`slug = ${idOrSlug}`}
    `
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const logs = await sql`
      SELECT 
        l.*, 
        u.name as user_name, 
        u.avatar_url as user_avatar 
      FROM wireframe_logs l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.project_id = ${project.id}
      ORDER BY l.created_at DESC
      LIMIT 100
    `

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Wireframe Logs GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
