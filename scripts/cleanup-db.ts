import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  // Radera alla ärenden och deras data (alla bolag)
  await prisma.caseFieldValue.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.case.deleteMany({});

  // Radera de två gamla testbolagen (inte demo-company-001)
  const extraCompanies = await prisma.company.findMany({
    where: { id: { not: "demo-company-001" } },
    select: { id: true, intakeEmail: true },
  });

  for (const c of extraCompanies) {
    await prisma.emailAccount.deleteMany({ where: { companyId: c.id } });
    await prisma.categoryField.deleteMany({
      where: { category: { companyId: c.id } },
    });
    await prisma.issueCategory.deleteMany({ where: { companyId: c.id } });
    await prisma.property.deleteMany({ where: { companyId: c.id } });
    await prisma.user.deleteMany({ where: { companyId: c.id } });
    await prisma.company.delete({ where: { id: c.id } });
    console.log(`Raderade bolag: ${c.intakeEmail}`);
  }

  console.log("Klar! demo-company-001 är nu det enda bolaget, utan ärenden.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
