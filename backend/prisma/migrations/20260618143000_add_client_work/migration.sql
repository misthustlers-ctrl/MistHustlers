CREATE TABLE "client_work" (
  "id" SERIAL NOT NULL,
  "client_name" TEXT NOT NULL,
  "client_phone" TEXT,
  "service" TEXT NOT NULL,
  "price" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'lead',
  "notes" TEXT,
  "agent_id" INTEGER,
  "partner_id" INTEGER,
  "agent_commission" INTEGER NOT NULL DEFAULT 0,
  "agent_paid" INTEGER NOT NULL DEFAULT 0,
  "partner_payout" INTEGER NOT NULL DEFAULT 0,
  "partner_paid" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "client_work_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "client_work_agent_id_idx" ON "client_work"("agent_id");
CREATE INDEX "client_work_partner_id_idx" ON "client_work"("partner_id");

ALTER TABLE "client_work"
  ADD CONSTRAINT "client_work_agent_id_fkey"
  FOREIGN KEY ("agent_id") REFERENCES "admin_users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "client_work"
  ADD CONSTRAINT "client_work_partner_id_fkey"
  FOREIGN KEY ("partner_id") REFERENCES "admin_users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
