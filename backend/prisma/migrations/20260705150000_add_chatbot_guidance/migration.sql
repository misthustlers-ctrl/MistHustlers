ALTER TABLE "chatbot_config"
  ADD COLUMN IF NOT EXISTS "response_tone" TEXT NOT NULL DEFAULT 'consultative',
  ADD COLUMN IF NOT EXISTS "sales_instructions" TEXT NOT NULL DEFAULT 'Ask one useful question at a time. Recommend only verified services and prices. Never invent guarantees, discounts or delivery dates.',
  ADD COLUMN IF NOT EXISTS "solution_instructions" TEXT NOT NULL DEFAULT 'After a service is selected, understand the business and recommend a tailored blueprint with priorities, integrations, automation opportunities, phased scope, and clear reasoning.',
  ADD COLUMN IF NOT EXISTS "unknown_answer" TEXT NOT NULL DEFAULT 'I do not have a verified answer for that yet. Please use the visible green WhatsApp button to send your inquiry to the MistHustlers team.',
  ADD COLUMN IF NOT EXISTS "generative_enabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "opencode_model" TEXT NOT NULL DEFAULT 'deepseek-v4-flash-free',
  ADD COLUMN IF NOT EXISTS "opencode_api_key_encrypted" TEXT;

UPDATE "chatbot_config"
SET "unknown_answer" = 'I do not have a verified answer for that yet. Please use the visible green WhatsApp button to send your inquiry to the MistHustlers team.'
WHERE "unknown_answer" = 'I do not have a verified answer for that yet. Please share a little more context, or contact the MistHustlers team.';
