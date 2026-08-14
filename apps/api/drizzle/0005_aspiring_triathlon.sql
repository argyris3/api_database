ALTER TABLE "projects" ALTER COLUMN "auth_jwt_secret" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "site_url";