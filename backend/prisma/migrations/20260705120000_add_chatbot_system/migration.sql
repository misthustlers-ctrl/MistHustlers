CREATE TABLE "knowledge_items" (
  "id" SERIAL NOT NULL,
  "source" TEXT NOT NULL,
  "source_id" TEXT,
  "category" TEXT NOT NULL,
  "subcategory" TEXT,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "hash" TEXT NOT NULL,
  "verification_status" TEXT NOT NULL DEFAULT 'verified',
  "risk_level" TEXT NOT NULL DEFAULT 'low',
  "requires_approval" BOOLEAN NOT NULL DEFAULT false,
  "approval_status" TEXT NOT NULL DEFAULT 'approved',
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "knowledge_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chatbot_config" (
  "id" SERIAL NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "greeting" TEXT NOT NULL DEFAULT 'Hi, I''m ARIA — MistHustlers'' Senior Sales Consultant. I''m here to understand your business and help you find the right digital solution. Before I recommend anything, I''d like to understand your current situation. What does your business do?',
  "greeting_hindi" TEXT NOT NULL DEFAULT 'नमस्ते, मैं ARIA हूँ — MistHustlers की Senior Sales Consultant। मैं आपके व्यवसाय को समझने और सही डिजिटल समाधान ढूंढने में आपकी मदद करने के लिए यहाँ हूँ। कुछ भी सुझाने से पहले, मैं आपकी मौजूदा स्थिति समझना चाहूँगी। आपका व्यवसाय क्या करता है?',
  "greeting_hinglish" TEXT NOT NULL DEFAULT 'Namaste, main ARIA hoon — MistHustlers ki Senior Sales Consultant. Main aapke business ko samajhne aur sahi digital solution dhundhne mein aapki madad karne ke liye yahan hoon. Kuch bhi suggest karne se pehle, main aapki current situation samajhna chahungi. Aapka business kya karta hai?',
  "primary_color" TEXT NOT NULL DEFAULT '#fc5000',
  "position" TEXT NOT NULL DEFAULT 'bottom-right',
  "max_message_length" INTEGER NOT NULL DEFAULT 2000,
  "session_ttl_minutes" INTEGER NOT NULL DEFAULT 43200,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "chatbot_config_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chat_sessions" (
  "id" SERIAL NOT NULL,
  "token" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'en',
  "language_source" TEXT NOT NULL DEFAULT 'auto',
  "state" TEXT NOT NULL DEFAULT 'greeting',
  "state_data" JSONB NOT NULL DEFAULT '{}',
  "lead_id" INTEGER,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "message_count" INTEGER NOT NULL DEFAULT 0,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chat_messages" (
  "id" SERIAL NOT NULL,
  "session_id" INTEGER,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "detected_language" TEXT,
  "metadata" JSONB DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "qualified_leads" (
  "id" SERIAL NOT NULL,
  "session_id" INTEGER NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "company" TEXT,
  "business_type" TEXT,
  "industry" TEXT,
  "goal" TEXT,
  "budget" TEXT,
  "timeline" TEXT,
  "service_interest" TEXT,
  "features" TEXT,
  "lead_score" INTEGER NOT NULL DEFAULT 0,
  "lead_category" TEXT NOT NULL DEFAULT 'nurture',
  "consent_given" BOOLEAN NOT NULL DEFAULT false,
  "consent_at" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'new',
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "qualified_leads_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "knowledge_sync_runs" (
  "id" SERIAL NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'running',
  "source" TEXT,
  "items_total" INTEGER NOT NULL DEFAULT 0,
  "items_added" INTEGER NOT NULL DEFAULT 0,
  "items_updated" INTEGER NOT NULL DEFAULT 0,
  "items_failed" INTEGER NOT NULL DEFAULT 0,
  "error_log" JSONB DEFAULT '[]',
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3),
  CONSTRAINT "knowledge_sync_runs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "knowledge_items_source_source_id_key_key" ON "knowledge_items"("source", "source_id", "key");
CREATE INDEX "knowledge_items_category_idx" ON "knowledge_items"("category");
CREATE INDEX "knowledge_items_approval_status_idx" ON "knowledge_items"("approval_status");
CREATE UNIQUE INDEX "chat_sessions_token_key" ON "chat_sessions"("token");
CREATE INDEX "chat_sessions_token_idx" ON "chat_sessions"("token");
CREATE INDEX "chat_sessions_expires_at_idx" ON "chat_sessions"("expires_at");
CREATE INDEX "chat_sessions_created_at_idx" ON "chat_sessions"("created_at");
CREATE INDEX "chat_messages_session_id_created_at_idx" ON "chat_messages"("session_id", "created_at");
CREATE UNIQUE INDEX "qualified_leads_session_id_key" ON "qualified_leads"("session_id");
CREATE INDEX "qualified_leads_lead_category_idx" ON "qualified_leads"("lead_category");
CREATE INDEX "qualified_leads_status_idx" ON "qualified_leads"("status");

ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "qualified_leads" ADD CONSTRAINT "qualified_leads_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
