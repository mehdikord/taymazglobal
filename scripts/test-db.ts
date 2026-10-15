import { prisma } from "../src/lib/db/prisma";

async function main() {
  const result = await prisma.$queryRaw<[{ ok: number }]>`SELECT 1 AS ok`;
  console.log("DB connected:", result[0]);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("DB connection failed:", err.message ?? err);
  process.exit(1);
});
