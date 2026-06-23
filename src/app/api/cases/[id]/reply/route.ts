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

  const [caseData, company] = await Promise.all([
    prisma.case.findUnique({
      where: { id },
      include: { messages: { orderBy: { sentAt: "asc" } } },
    }),
    prisma.company.findUnique({
      where: { id: session.user.companyId },
      select: { signature: true },
    }),
  ]);

  if (!caseData || caseData.companyId !== session.user.companyId) {
    return NextResponse.json({ error: "Ärende hittades inte" }, { status: 404 });
  }

  const signature = company?.signature?.trim() ?? "";
  const fullBody = signature ? `${body.trim()}\n\n${signature}` : body.trim();

  const lastMessage = caseData.messages.at(-1);
  const allEmailIds = caseData.messages
    .map((m) => m.emailId)
    .filter(Boolean) as string[];

  const replySubject = caseData.subject.startsWith("Re:")
    ? caseData.subject
    : `Re: ${caseData.subject}`;

  const sentMessageId = await sendEmailAsPropertyManager({
    companyId: caseData.companyId,
    to: caseData.residentEmail,
    subject: replySubject,
    body: fullBody,
    inReplyTo: lastMessage?.emailId ?? undefined,
    references: allEmailIds.join(" "),
  });

  const message = await prisma.message.create({
    data: {
      caseId: id,
      fromResident: false,
      body: fullBody,
      emailId: sentMessageId,
    },
  });

  return NextResponse.json({ ok: true, message });
}
