import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";

const client = new Anthropic();

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const { subject, residentName, residentEmail, category, messages } =
    (await req.json()) as {
      subject: string;
      residentName: string | null;
      residentEmail: string;
      category: string;
      messages: { fromResident: boolean; body: string }[];
    };

  const transcript = messages
    .map((m) => `${m.fromResident ? "Hyresgäst" : "Handläggare"}: ${m.body}`)
    .join("\n\n");

  const prompt = `Sammanfatta följande fastighetsärende på svenska i 3–5 meningar för servicepersonalen som ska åtgärda det. Inkludera: vad problemet är, var det finns (adress/lägenhet om nämnt), hur akut det verkar, och relevanta kontaktuppgifter.

Ärenderubrik: ${subject}
Hyresgäst: ${residentName ?? "okänd"} (${residentEmail})
Ärendekategori: ${category}

Konversation:
${transcript}`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const summary =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ summary, error: null });
  } catch (e) {
    return NextResponse.json({
      summary: "",
      error: e instanceof Error ? e.message : "Okänt fel",
    });
  }
}
