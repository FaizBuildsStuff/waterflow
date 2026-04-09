import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import OpenAI from 'openai';
import { checkAiUsage, incrementAiUsage } from '@/lib/usage';

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API,
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const usage = await checkAiUsage(payload.id);
    if (!usage.allowed) {
      return NextResponse.json({ error: usage.error }, { status: 403 });
    }

    const { tasks } = await req.json();
    if (!tasks || !Array.isArray(tasks)) return NextResponse.json({ error: 'Tasks array is required' }, { status: 400 });

    const prompt = `
      You are a professional project manager. Re-order the following list of tasks by urgency, priority, and dependencies.
      Criteria:
      1. High priority tasks should be first.
      2. Tasks with earlier due dates should be higher.
      3. Tasks that block other tasks (are in the 'Blocked By' list of other tasks) should be prioritized.
      
      Tasks:
      ${tasks.map(t => `- ID: ${t.id}, Title: ${t.title}, Priority: ${t.priority}, Due: ${t.due_date || 'N/A'}, Blocked By: ${t.blocked_by_ids?.join(',') || 'None'}`).join('\n')}
      
      Return a JSON object with a key "order" containing the task IDs in the new recommended order. 
      Example: { "order": [5, 2, 8, 1] }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI prioritization engine. Return only a JSON object." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"order": []}');
    
    await incrementAiUsage(payload.id);
    
    return NextResponse.json({ order: result.order });
  } catch (error: any) {
    console.error('AI Prioritize error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
