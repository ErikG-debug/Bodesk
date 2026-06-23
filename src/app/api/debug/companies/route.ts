import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Temporär diagnos-route — ta bort efter felsökning
export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const companies = await prisma.company.findMany({
    include: {
      emailAccount: { select: { email: true, provider: true, expiresAt: true } },
      users: { select: { email: true, role: true } },
    },
  });

  return NextResponse.json({
    sessionCompanyId: session.user.companyId,
    sessionEmail: session.user.email,
    companies: companies.map((c) => ({
      id: c.id,
      name: c.name,
      intakeEmail: c.intakeEmail,
      emailAccount: c.emailAccount
        ? { email: c.emailAccount.email, provider: c.emailAccount.provider, expiresAt: c.emailAccount.expiresAt }
        : null,
      users: c.users,
    })),
  });
}

// Raderar bolag utan användare (skräp från gamla seeds/cleanup)
export async function DELETE(): Promise<NextResponse> {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });

  const stale = await prisma.company.findMany({
    where: { users: { none: {} } },
    select: { id: true, name: true, intakeEmail: true },
  });

  const deleted: string[] = [];
  for (const c of stale) {
    await prisma.emailAccount.deleteMany({ where: { companyId: c.id } });
    await prisma.caseFieldValue.deleteMany({ where: { case: { companyId: c.id } } });
    await prisma.message.deleteMany({ where: { case: { companyId: c.id } } });
    await prisma.case.deleteMany({ where: { companyId: c.id } });
    await prisma.categoryField.deleteMany({ where: { category: { companyId: c.id } } });
    await prisma.issueCategory.deleteMany({ where: { companyId: c.id } });
    await prisma.property.deleteMany({ where: { companyId: c.id } });
    await prisma.company.delete({ where: { id: c.id } });
    deleted.push(`${c.name} (${c.id})`);
  }

  return NextResponse.json({ deleted });
}
