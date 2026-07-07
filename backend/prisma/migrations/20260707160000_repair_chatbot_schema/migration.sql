-- Repairs production databases where the original chatbot migration was marked
-- applied without creating all objects. Every operation is additive/idempotent.
CREATE TABLE IF NOT EXISTS "knowledge_items" (
  "id" SERIAL PRIMARY KEY, "source" TEXT NOT NULL, "source_id" TEXT, "category" TEXT NOT NULL,
  "subcategory" TEXT, "key" TEXT NOT NULL, "value" TEXT NOT NULL, "version" INTEGER NOT NULL DEFAULT 1,
  "hash" TEXT NOT NULL, "verification_status" TEXT NOT NULL DEFAULT 'verified', "risk_level" TEXT NOT NULL DEFAULT 'low',
  "requires_approval" BOOLEAN NOT NULL DEFAULT false, "approval_status" TEXT NOT NULL DEFAULT 'approved',
  "published_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "chatbot_config" (
  "id" SERIAL PRIMARY KEY, "enabled" BOOLEAN NOT NULL DEFAULT true,
  "greeting" TEXT NOT NULL DEFAULT 'Hi, I''m ARIA. How can I help with your business?',
  "greeting_hindi" TEXT NOT NULL DEFAULT 'Namaste, main ARIA hoon. Main aapke business mein kaise madad kar sakti hoon?',
  "greeting_hinglish" TEXT NOT NULL DEFAULT 'Namaste, main ARIA hoon. Main aapke business mein kaise help kar sakti hoon?',
  "primary_color" TEXT NOT NULL DEFAULT '#fc5000', "position" TEXT NOT NULL DEFAULT 'bottom-right',
  "max_message_length" INTEGER NOT NULL DEFAULT 2000, "session_ttl_minutes" INTEGER NOT NULL DEFAULT 43200,
  "response_tone" TEXT NOT NULL DEFAULT 'consultative',
  "sales_instructions" TEXT NOT NULL DEFAULT 'Ask one useful question at a time. Recommend only verified services and prices.',
  "solution_instructions" TEXT NOT NULL DEFAULT 'After a service is selected, understand the business and recommend a tailored blueprint.',
  "unknown_answer" TEXT NOT NULL DEFAULT 'I do not have a verified answer yet. Please use the visible WhatsApp button.',
  "generative_enabled" BOOLEAN NOT NULL DEFAULT true, "opencode_model" TEXT NOT NULL DEFAULT 'deepseek-v4-flash-free',
  "opencode_api_key_encrypted" TEXT, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

ALTER TABLE "chatbot_config"
  ADD COLUMN IF NOT EXISTS "response_tone" TEXT NOT NULL DEFAULT 'consultative',
  ADD COLUMN IF NOT EXISTS "sales_instructions" TEXT NOT NULL DEFAULT 'Ask one useful question at a time. Recommend only verified services and prices.',
  ADD COLUMN IF NOT EXISTS "solution_instructions" TEXT NOT NULL DEFAULT 'After a service is selected, understand the business and recommend a tailored blueprint.',
  ADD COLUMN IF NOT EXISTS "unknown_answer" TEXT NOT NULL DEFAULT 'I do not have a verified answer yet. Please use the visible WhatsApp button.',
  ADD COLUMN IF NOT EXISTS "generative_enabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "opencode_model" TEXT NOT NULL DEFAULT 'deepseek-v4-flash-free',
  ADD COLUMN IF NOT EXISTS "opencode_api_key_encrypted" TEXT;

CREATE TABLE IF NOT EXISTS "chat_sessions" (
  "id" SERIAL PRIMARY KEY, "token" TEXT NOT NULL, "language" TEXT NOT NULL DEFAULT 'en',
  "language_source" TEXT NOT NULL DEFAULT 'auto', "state" TEXT NOT NULL DEFAULT 'greeting',
  "state_data" JSONB NOT NULL DEFAULT '{}', "lead_id" INTEGER, "is_active" BOOLEAN NOT NULL DEFAULT true,
  "message_count" INTEGER NOT NULL DEFAULT 0, "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "chat_messages" (
  "id" SERIAL PRIMARY KEY, "session_id" INTEGER NOT NULL, "role" TEXT NOT NULL, "content" TEXT NOT NULL,
  "detected_language" TEXT, "metadata" JSONB DEFAULT '{}', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "qualified_leads" (
  "id" SERIAL PRIMARY KEY, "session_id" INTEGER, "name" TEXT, "email" TEXT, "phone" TEXT, "company" TEXT,
  "business_type" TEXT, "industry" TEXT, "goal" TEXT, "budget" TEXT, "timeline" TEXT, "service_interest" TEXT,
  "features" TEXT, "lead_score" INTEGER NOT NULL DEFAULT 0, "lead_category" TEXT NOT NULL DEFAULT 'nurture',
  "consent_given" BOOLEAN NOT NULL DEFAULT false, "consent_at" TIMESTAMP(3), "status" TEXT NOT NULL DEFAULT 'new',
  "notes" TEXT, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "knowledge_sync_runs" (
  "id" SERIAL PRIMARY KEY, "status" TEXT NOT NULL DEFAULT 'running', "source" TEXT,
  "items_total" INTEGER NOT NULL DEFAULT 0, "items_added" INTEGER NOT NULL DEFAULT 0,
  "items_updated" INTEGER NOT NULL DEFAULT 0, "items_failed" INTEGER NOT NULL DEFAULT 0,
  "error_log" JSONB DEFAULT '[]', "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3)
);

CREATE UNIQUE INDEX IF NOT EXISTS "knowledge_items_source_source_id_key_key" ON "knowledge_items"("source", "source_id", "key");
CREATE INDEX IF NOT EXISTS "knowledge_items_category_idx" ON "knowledge_items"("category");
CREATE INDEX IF NOT EXISTS "knowledge_items_approval_status_idx" ON "knowledge_items"("approval_status");
CREATE UNIQUE INDEX IF NOT EXISTS "chat_sessions_token_key" ON "chat_sessions"("token");
CREATE INDEX IF NOT EXISTS "chat_sessions_token_idx" ON "chat_sessions"("token");
CREATE INDEX IF NOT EXISTS "chat_sessions_expires_at_idx" ON "chat_sessions"("expires_at");
CREATE INDEX IF NOT EXISTS "chat_sessions_created_at_idx" ON "chat_sessions"("created_at");
CREATE INDEX IF NOT EXISTS "chat_messages_session_id_created_at_idx" ON "chat_messages"("session_id", "created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "qualified_leads_session_id_key" ON "qualified_leads"("session_id");
CREATE INDEX IF NOT EXISTS "qualified_leads_lead_category_idx" ON "qualified_leads"("lead_category");
CREATE INDEX IF NOT EXISTS "qualified_leads_status_idx" ON "qualified_leads"("status");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chat_messages_session_id_fkey') THEN
    ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey"
      FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'qualified_leads_session_id_fkey') THEN
    ALTER TABLE "qualified_leads" ADD CONSTRAINT "qualified_leads_session_id_fkey"
      FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
