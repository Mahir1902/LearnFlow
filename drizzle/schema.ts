import { pgTable, unique, uuid, varchar, text, timestamp, foreignKey, bigserial, jsonb, vector } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	email: varchar().notNull(),
	fullName: text("full_name"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const messages = pgTable("messages", {
	id: uuid().primaryKey().notNull(),
	chatId: uuid("chat_id"),
	content: text().notNull(),
	role: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "messages_chat_id_chats_id_fk"
		}),
]);

export const documents = pgTable("documents", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	content: text(),
	metadata: jsonb(),
	embedding: vector({ dimensions: 1536 }),
});

export const chats = pgTable("chats", {
	id: uuid().primaryKey().notNull(),
	title: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id"),
	videoId: text("video_id").notNull(),
	videoUrl: text("video_url").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "chats_user_id_users_id_fk"
		}),
]);
