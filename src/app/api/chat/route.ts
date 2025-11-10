import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    const history = body?.history || [];

    // Optional: send a loading state if requested
    if (body?.showLoading) {
      return NextResponse.json({
        sources: [],
        summary: "Thinking...",
        points: []
      });
    }

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `You are ArqenAI 🏛️, a friendly and professional assistant. Always reply in a natural, human-like, conversational tone — clear, warm, and easy to read. 
Do not sound robotic. Always begin with a short greeting or acknowledgment before helping. 
Always reply ONLY in valid JSON, nothing else, using this format:
{
  "sources": ["https://example.com/link1", "https://example.com/link2"],
  "summary": "A natural, human-written paragraph that feels like real conversation. Only add emojis occasionally and sparingly, at most 1–2 if truly relevant.",
  "points": ["bullet point 1", "bullet point 2", "bullet point 3"]
}
Only include sources if you know relevant ones (otherwise leave empty). Use emojis rarely (no more than 1–2, only if strongly relevant). Do not include explanations, comments, or text outside JSON.`,
          },
          ...history,
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("OpenAI API Error:", data.error || data);
      return NextResponse.json(
        { error: data.error?.message || "OpenAI request failed" },
        { status: 500 }
      );
    }

    const replyMessage = data.choices?.[0]?.message?.content;

    let parsed = {
      sources: [] as string[],
      summary: "⚠️ No response from AI.",
      points: [] as string[],
      role: "assistant",
      content: "⚠️ No response from AI."
    };

    if (replyMessage) {
      try {
        const jsonParsed = JSON.parse(replyMessage);
        parsed = {
          ...jsonParsed,
          role: "assistant",
          content: jsonParsed.summary || replyMessage,
        };
      } catch {
        parsed = {
          sources: [],
          summary: replyMessage,
          points: [],
          role: "assistant",
          content: replyMessage,
        };
      }
    }

    // Clerk authentication
    const { userId } = getAuth(req);
    if (userId) {
      console.log("✅ Clerk user authenticated:", userId);
    } else {
      console.log("⚠️ No Clerk user authenticated");
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}