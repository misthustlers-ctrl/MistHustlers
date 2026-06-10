import prisma from "./client.js";
import { seedContent } from "./seed-content.js";

async function main() {
  await seedContent();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
