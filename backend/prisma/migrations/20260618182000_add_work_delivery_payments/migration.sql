ALTER TABLE "client_work"
ADD COLUMN IF NOT EXISTS "delivery_link" TEXT,
ADD COLUMN IF NOT EXISTS "delivery_notes" TEXT,
ADD COLUMN IF NOT EXISTS "submitted_at" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "work_payments" (
  "id" SERIAL PRIMARY KEY,
  "work_id" INTEGER NOT NULL,
  "role" TEXT NOT NULL,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "note" TEXT,
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "work_payments_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "client_work"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "work_payments_work_id_idx" ON "work_payments"("work_id");
