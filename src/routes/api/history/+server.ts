import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { councilSession } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const sessions = db
		.select()
		.from(councilSession)
		.orderBy(desc(councilSession.createdAt))
		.limit(10)
		.all();

	return json(sessions);
};
