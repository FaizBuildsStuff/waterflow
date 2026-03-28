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

    // Check usage
    const usage = await checkAiUsage(payload.id);
    if (!usage.allowed) {
      return NextResponse.json({ error: usage.error }, { status: 403 });
    }

    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a professional project manager. Write a concise, actionable, 2-3 sentence description for a task based on its title. Use professional agency tone." 
        },
        { role: "user", content: `Task Title: ${title}` }
      ],
    });

    const description = completion.choices[0].message.content;
    
    // Increment usage
    await incrementAiUsage(payload.id);
    
    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('AI Describe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
