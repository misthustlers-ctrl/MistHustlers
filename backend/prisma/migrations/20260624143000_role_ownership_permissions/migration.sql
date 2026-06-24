ALTER TABLE "inquiries"
  ADD COLUMN IF NOT EXISTS "owner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "acquisition_partner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "affiliate_partner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "assigned_hr_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "lead_source" TEXT;

ALTER TABLE "applicants"
  ADD COLUMN IF NOT EXISTS "assigned_hr_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "position_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "application_type" TEXT NOT NULL DEFAULT 'career',
  ADD COLUMN IF NOT EXISTS "current_stage" TEXT NOT NULL DEFAULT 'new';

ALTER TABLE "projects"
  ADD COLUMN IF NOT EXISTS "acquisition_partner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "delivery_partner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "affiliate_partner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "assigned_hr_id" INTEGER;

ALTER TABLE "client_work"
  ADD COLUMN IF NOT EXISTS "inquiry_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "acquisition_partner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "delivery_partner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "affiliate_partner_id" INTEGER,
  ADD COLUMN IF NOT EXISTS "assigned_hr_id" INTEGER;

CREATE TABLE IF NOT EXISTS "partner_profiles" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL UNIQUE,
  "partner_type" TEXT NOT NULL,
  "category" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "referral_codes" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "owner_id" INTEGER NOT NULL,
  "owner_role" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "referral_events" (
  "id" SERIAL PRIMARY KEY,
  "referral_code_id" INTEGER NOT NULL,
  "event_type" TEXT NOT NULL,
  "path" TEXT,
  "ip_hash" TEXT,
  "user_agent" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "referral_attributions" (
  "id" SERIAL PRIMARY KEY,
  "referral_code_id" INTEGER NOT NULL,
  "target_type" TEXT NOT NULL,
  "target_id" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "inquiries_owner_id_idx" ON "inquiries"("owner_id");
CREATE INDEX IF NOT EXISTS "inquiries_acquisition_partner_id_idx" ON "inquiries"("acquisition_partner_id");
CREATE INDEX IF NOT EXISTS "inquiries_affiliate_partner_id_idx" ON "inquiries"("affiliate_partner_id");
CREATE INDEX IF NOT EXISTS "inquiries_assigned_hr_id_idx" ON "inquiries"("assigned_hr_id");

CREATE INDEX IF NOT EXISTS "applicants_assigned_hr_id_idx" ON "applicants"("assigned_hr_id");
CREATE INDEX IF NOT EXISTS "applicants_position_id_idx" ON "applicants"("position_id");

CREATE INDEX IF NOT EXISTS "projects_acquisition_partner_id_idx" ON "projects"("acquisition_partner_id");
CREATE INDEX IF NOT EXISTS "projects_delivery_partner_id_idx" ON "projects"("delivery_partner_id");
CREATE INDEX IF NOT EXISTS "projects_affiliate_partner_id_idx" ON "projects"("affiliate_partner_id");
CREATE INDEX IF NOT EXISTS "projects_assigned_hr_id_idx" ON "projects"("assigned_hr_id");

CREATE INDEX IF NOT EXISTS "client_work_inquiry_id_idx" ON "client_work"("inquiry_id");
CREATE INDEX IF NOT EXISTS "client_work_acquisition_partner_id_idx" ON "client_work"("acquisition_partner_id");
CREATE INDEX IF NOT EXISTS "client_work_delivery_partner_id_idx" ON "client_work"("delivery_partner_id");
CREATE INDEX IF NOT EXISTS "client_work_affiliate_partner_id_idx" ON "client_work"("affiliate_partner_id");
CREATE INDEX IF NOT EXISTS "client_work_assigned_hr_id_idx" ON "client_work"("assigned_hr_id");

CREATE INDEX IF NOT EXISTS "partner_profiles_partner_type_idx" ON "partner_profiles"("partner_type");
CREATE INDEX IF NOT EXISTS "referral_codes_owner_id_idx" ON "referral_codes"("owner_id");
CREATE INDEX IF NOT EXISTS "referral_events_referral_code_id_idx" ON "referral_events"("referral_code_id");
CREATE INDEX IF NOT EXISTS "referral_attributions_referral_code_id_idx" ON "referral_attributions"("referral_code_id");
CREATE INDEX IF NOT EXISTS "referral_attributions_target_type_target_id_idx" ON "referral_attributions"("target_type", "target_id");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inquiries_owner_id_fkey') THEN
    ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inquiries_acquisition_partner_id_fkey') THEN
    ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_acquisition_partner_id_fkey" FOREIGN KEY ("acquisition_partner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inquiries_affiliate_partner_id_fkey') THEN
    ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_affiliate_partner_id_fkey" FOREIGN KEY ("affiliate_partner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inquiries_assigned_hr_id_fkey') THEN
    ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assigned_hr_id_fkey" FOREIGN KEY ("assigned_hr_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'applicants_assigned_hr_id_fkey') THEN
    ALTER TABLE "applicants" ADD CONSTRAINT "applicants_assigned_hr_id_fkey" FOREIGN KEY ("assigned_hr_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_acquisition_partner_id_fkey') THEN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_acquisition_partner_id_fkey" FOREIGN KEY ("acquisition_partner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_delivery_partner_id_fkey') THEN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_delivery_partner_id_fkey" FOREIGN KEY ("delivery_partner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_affiliate_partner_id_fkey') THEN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_affiliate_partner_id_fkey" FOREIGN KEY ("affiliate_partner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_assigned_hr_id_fkey') THEN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_assigned_hr_id_fkey" FOREIGN KEY ("assigned_hr_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_work_inquiry_id_fkey') THEN
    ALTER TABLE "client_work" ADD CONSTRAINT "client_work_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_work_acquisition_partner_id_fkey') THEN
    ALTER TABLE "client_work" ADD CONSTRAINT "client_work_acquisition_partner_id_fkey" FOREIGN KEY ("acquisition_partner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_work_delivery_partner_id_fkey') THEN
    ALTER TABLE "client_work" ADD CONSTRAINT "client_work_delivery_partner_id_fkey" FOREIGN KEY ("delivery_partner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_work_affiliate_partner_id_fkey') THEN
    ALTER TABLE "client_work" ADD CONSTRAINT "client_work_affiliate_partner_id_fkey" FOREIGN KEY ("affiliate_partner_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_work_assigned_hr_id_fkey') THEN
    ALTER TABLE "client_work" ADD CONSTRAINT "client_work_assigned_hr_id_fkey" FOREIGN KEY ("assigned_hr_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'partner_profiles_user_id_fkey') THEN
    ALTER TABLE "partner_profiles" ADD CONSTRAINT "partner_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'referral_codes_owner_id_fkey') THEN
    ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'referral_events_referral_code_id_fkey') THEN
    ALTER TABLE "referral_events" ADD CONSTRAINT "referral_events_referral_code_id_fkey" FOREIGN KEY ("referral_code_id") REFERENCES "referral_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'referral_attributions_referral_code_id_fkey') THEN
    ALTER TABLE "referral_attributions" ADD CONSTRAINT "referral_attributions_referral_code_id_fkey" FOREIGN KEY ("referral_code_id") REFERENCES "referral_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
