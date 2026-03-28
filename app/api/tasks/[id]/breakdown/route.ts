import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const token = req.cookies.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Verify task access
    const [task] = await sql`
      SELECT t.*, p.id as project_id 
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = ${taskId}
    `;

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    // Call OpenAI to break down the task
    const apiKey = process.env.CHATGPT_API;
    if (!apiKey) return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a task management assistant. Break down the given task into 4-6 actionable subtasks. Each subtask should have a title and a boolean "completed" status (always false initially). Return a JSON object with a key "subtasks" which is an array of objects.'
          },
          {
            role: 'user',
            content: `Task: "${task.title}"\nDescription: "${task.description || ''}"`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const resContent = JSON.parse(data.choices[0].message.content);
    const subtasks = resContent.subtasks || [];

    // Update task subtasks in DB
    const [updatedTask] = await sql`
      UPDATE tasks 
      SET subtasks = ${JSON.stringify(subtasks)}
      WHERE id = ${taskId}
      RETURNING *
    `;

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Task Breakdown error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
