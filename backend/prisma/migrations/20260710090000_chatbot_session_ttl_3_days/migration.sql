ALTER TABLE "chatbot_config" ALTER COLUMN "session_ttl_minutes" SET DEFAULT 4320;

UPDATE "chatbot_config"
SET "session_ttl_minutes" = 4320
WHERE "session_ttl_minutes" = 43200;
