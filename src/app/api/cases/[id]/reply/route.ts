import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEmailAsPropertyManager } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const { id } = await params;
  const { body } = await req.json();

  if (!body?.trim()) {
    return NextResponse.json({ error: "Tomt meddelande" }, { status: 400 });
  }

  const caseData = await prisma.case.findUnique({
    where: { id },
    include: { messages: { orderBy: { sentAt: "asc" } } },
  });

  if (!caseData || caseData.companyId !== session.user.companyId) {
    return NextResponse.json({ error: "Ärende hittades inte" }, { status: 404 });
  }

  const lastMessage = caseData.messages.at(-1);
  const replySubject = caseData.subject.startsWith("Re:")
    ? caseData.subject
    : `Re: ${caseData.subject}`;

  const sentMessageId = await sendEmailAsPropertyManager({
    companyId: caseData.companyId,
    to: caseData.residentEmail,
    subject: replySubject,
    body: body.trim(),
    inReplyTo: lastMessage?.emailId ?? undefined,
    references: lastMessage?.emailId ?? undefined,
  });

  const message = await prisma.message.create({
    data: {
      caseId: id,
      fromResident: false,
      body: body.trim(),
      emailId: sentMessageId,
    },
  });

  return NextResponse.json({ ok: true, message });
}
