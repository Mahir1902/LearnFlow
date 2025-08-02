import { relations } from "drizzle-orm/relations";
import { chats, messages, users } from "./schema";

export const messagesRelations = relations(messages, ({one}) => ({
	chat: one(chats, {
		fields: [messages.chatId],
		references: [chats.id]
	}),
}));

export const chatsRelations = relations(chats, ({one, many}) => ({
	messages: many(messages),
	user: one(users, {
		fields: [chats.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	chats: many(chats),
}));