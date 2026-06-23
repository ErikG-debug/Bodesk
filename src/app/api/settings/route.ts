import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    select: { signature: true },
  });

  return NextResponse.json({ signature: company?.signature ?? "" });
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const { signature } = await req.json();
  if (typeof signature !== "string") {
    return NextResponse.json({ error: "Ogiltig signatur" }, { status: 400 });
  }

  await prisma.company.update({
    where: { id: session.user.companyId },
    data: { signature },
  });

  return NextResponse.json({ ok: true });
}
