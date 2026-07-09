import prisma from "../prisma/client.js";

try {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "chatbot_config" (
      "id" SERIAL PRIMARY KEY,
      "enabled" BOOLEAN NOT NULL DEFAULT true,
      "greeting" TEXT NOT NULL DEFAULT 'Hi, I am ARIA. How can I help with your business?',
      "greeting_hindi" TEXT NOT NULL DEFAULT 'Namaste, main ARIA hoon. Main aapke business mein kaise madad kar sakti hoon?',
      "greeting_hinglish" TEXT NOT NULL DEFAULT 'Namaste, main ARIA hoon. Main aapke business mein kaise help kar sakti hoon?',
      "primary_color" TEXT NOT NULL DEFAULT '#fc5000',
      "position" TEXT NOT NULL DEFAULT 'bottom-right',
      "max_message_length" INTEGER NOT NULL DEFAULT 2000,
      "session_ttl_minutes" INTEGER NOT NULL DEFAULT 4320,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL
    )
  `);

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "chatbot_config"
      ADD COLUMN IF NOT EXISTS "response_tone" TEXT NOT NULL DEFAULT 'consultative',
      ADD COLUMN IF NOT EXISTS "sales_instructions" TEXT NOT NULL DEFAULT 'Ask one useful question at a time. Recommend only verified services and prices.',
      ADD COLUMN IF NOT EXISTS "solution_instructions" TEXT NOT NULL DEFAULT 'After a service is selected, understand the business and recommend a tailored blueprint.',
      ADD COLUMN IF NOT EXISTS "unknown_answer" TEXT NOT NULL DEFAULT 'I do not have a verified answer yet. Please use the visible WhatsApp button.',
      ADD COLUMN IF NOT EXISTS "generative_enabled" BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS "opencode_model" TEXT NOT NULL DEFAULT 'deepseek-v4-flash-free',
      ADD COLUMN IF NOT EXISTS "opencode_api_key_encrypted" TEXT
  `);

  console.log("[chatbot] Configuration schema is ready.");
} catch (error) {
  console.error(`[chatbot] Configuration schema repair failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
