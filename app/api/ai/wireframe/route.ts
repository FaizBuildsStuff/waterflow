import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { checkAiUsage, incrementAiUsage } from "@/lib/usage";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentElements } = await req.json();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check Subscription Gating
    const usage = await checkAiUsage(payload.id);
    if (!usage.allowed || usage.tier === "free") {
      return NextResponse.json(
        {
          error:
            "AI Designer is a Premium Feature. Upgrade to Pro Flow or Neural Engine to unlock.",
          code: "UPGRADE_REQUIRED",
        },
        { status: 403 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Mock aesthetic design if no API key
      const mockResult = [
        {
          id: "ai-1",
          type: "box",
          x: 100,
          y: 100,
          w: 800,
          h: 500,
          label: "Modern Hero Section",
        },
        {
          id: "ai-2",
          type: "text",
          x: 200,
          y: 200,
          w: 500,
          h: 60,
          label: "Elevating Reality Through Code",
        },
        {
          id: "ai-3",
          type: "button",
          x: 200,
          y: 300,
          w: 160,
          h: 50,
          label: "Launch Project",
        },
        {
          id: "ai-4",
          type: "image",
          x: 100,
          y: 650,
          w: 250,
          h: 250,
          label: "Dynamic Asset 1",
        },
        {
          id: "ai-5",
          type: "image",
          x: 375,
          y: 650,
          w: 250,
          h: 250,
          label: "Dynamic Asset 2",
        },
        {
          id: "ai-6",
          type: "image",
          x: 650,
          y: 650,
          w: 250,
          h: 250,
          label: "Dynamic Asset 3",
        },
      ];
      return NextResponse.json({ elements: mockResult });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert UI/UX designer. Your task is to generate a JSON array of wireframe elements based on a user's prompt. 
          Respond ONLY with a valid JSON array of objects. 
          Each object must have:
          - id (unique string)
          - type ('box', 'text', 'image', 'button')
          - x, y, w, h (numbers)
          - label (descriptive name/content)
          
          Focus on creating a "full fledge web design" with headers, hero sections, features grids, and footers.
          Keep coordinates within a 1200x2000 canvas. Use 'box' for sections.`,
        },
        {
          role: "user",
          content: `Prompt: ${prompt}\n\nCurrent elements: ${JSON.stringify(currentElements)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(
      completion.choices[0].message.content || '{"elements": []}',
    );

    await incrementAiUsage(payload.id);

    return NextResponse.json({ elements: result.elements || [] });
  } catch (error) {
    console.error("AI Wireframe error:", error);
    return NextResponse.json(
      { error: "Failed to generate design" },
      { status: 500 },
    );
  }
}
