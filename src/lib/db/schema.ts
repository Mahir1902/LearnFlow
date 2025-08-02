import {
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
  jsonb,
  integer,
  boolean,
  pgEnum,
  bigserial,
  vector,
  bigint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  fullName: text("full_name"),
  // avatarUrl: text('avatar_url'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  content: text(),
  metadata: jsonb(),
  embedding: vector({ dimensions: 1536 }),
});

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: uuid("user_id").references(() => users.id),
  // documentId: uuid('document_id').references(() => documents.id),
  videoId: text("video_id").notNull(),
  videoUrl: text("video_url").notNull(),
});


export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().notNull(),
  chatId: uuid("chat_id").references(() => chats.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  role: text("role", {enum: ["user", "assistant"]}).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));