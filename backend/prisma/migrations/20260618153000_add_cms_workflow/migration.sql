CREATE TABLE "content_drafts" (
  "id" TEXT NOT NULL,
  "page" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "content_drafts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "content_drafts_page_key" ON "content_drafts"("page");

CREATE TABLE "content_revisions" (
  "id" SERIAL NOT NULL,
  "page" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "action" TEXT NOT NULL DEFAULT 'publish',
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "content_revisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "content_revisions_page_idx" ON "content_revisions"("page");

CREATE TABLE "media_assets" (
  "id" SERIAL NOT NULL,
  "url" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "label" TEXT,
  "category" TEXT,
  "alt_text" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "media_assets_url_key" ON "media_assets"("url");

CREATE TABLE "activity_logs" (
  "id" SERIAL NOT NULL,
  "actor" TEXT,
  "role" TEXT,
  "action" TEXT NOT NULL,
  "target" TEXT,
  "detail" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at");
