-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "documents" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"content" text,
	"metadata" jsonb,
	"embedding" vector(1536)
);

*/