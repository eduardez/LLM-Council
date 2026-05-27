import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { persona } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const personas = db.select().from(persona).all();
	return json(personas);
};
