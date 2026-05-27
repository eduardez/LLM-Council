import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const persona = sqliteTable('persona', {
	id: integer('id').primaryKey(),
	glyph: text('glyph').notNull(),
	name: text('name').notNull(),
	role: text('role').notNull(),
	tag: text('tag').notNull(),
	tagBg: text('tag_bg').notNull(),
	tagColor: text('tag_color').notNull(),
	spine: text('spine').notNull(),
	quote: text('quote').notNull(),
	conflicts: text('conflicts').notNull().default('[]'),
	prompt: text('prompt').notNull(),
	order: integer('order').notNull().default(0)
});

export const councilSession = sqliteTable('council_session', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	question: text('question').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
