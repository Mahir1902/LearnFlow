import { pgTable, varchar, timestamp, bigserial, text, jsonb, vector, uuid } from "drizzle-orm/pg-core"


export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    email: varchar('email').notNull().unique(),
    fullName: text('full_name'),
    // avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });

export const documents = pgTable("documents", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	content: text(),
	metadata: jsonb(),
	embedding: vector({ dimensions: 1536 }),
});
