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

    const [wireframe] = await sql`
      SELECT elements FROM wireframes WHERE project_id = ${project.id}
    `

    return NextResponse.json({ elements: wireframe?.elements || [] })
  } catch (error) {
    console.error('Wireframe GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSlug } = await params
    const { elements, action, details } = await req.json()
    
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

    // Upsert wireframe
    await sql`
      INSERT INTO wireframes (project_id, elements, updated_at)
      VALUES (${project.id}, ${elements}::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (project_id) DO UPDATE 
      SET elements = EXCLUDED.elements, updated_at = CURRENT_TIMESTAMP
    `

    // Log the action if provided
    if (action) {
      await sql`
        INSERT INTO wireframe_logs (project_id, user_id, action, details)
        VALUES (${project.id}, ${payload.id}, ${action}, ${details || ''})
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wireframe POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
