import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEmailAsPropertyManager } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const { id } = await params;
  const { to, subject: customSubject, message } = (await req.json()) as {
    to: string;
    subject?: string;
    message: string;
  };

  if (!to?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Mottagare och meddelande krävs" }, { status: 400 });
  }

  const caseData = await prisma.case.findUnique({
    where: { id },
    select: { companyId: true, subject: true },
  });

  if (!caseData || caseData.companyId !== session.user.companyId) {
    return NextResponse.json({ error: "Ärende hittades inte" }, { status: 404 });
  }

  const subject = customSubject ?? `Ärende: ${caseData.subject}`;

  await sendEmailAsPropertyManager({
    companyId: caseData.companyId,
    to: to.trim(),
    subject,
    body: message.trim(),
  });

  return NextResponse.json({ ok: true });
}
