import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
async function main() {
  const count = await prisma.case.count();
  console.log('Antal ärenden:', count);
  await prisma.message.deleteMany({});
  await prisma.caseFieldValue.deleteMany({});
  await prisma.case.deleteMany({});
  console.log('Klart, alla ärenden raderade!');
  await prisma.$disconnect();
}
main();
