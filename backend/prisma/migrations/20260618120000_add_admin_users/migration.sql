CREATE TABLE "admin_users" (
  "id" SERIAL NOT NULL,
  "username" TEXT NOT NULL,
  "display_name" TEXT,
  "password_hash" TEXT NOT NULL,
  "salt" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'agent',
  "status" TEXT NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");
