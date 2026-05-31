import { TUTORIALS } from '$lib/content/tutorials';

export const entries = () => {
	return TUTORIALS.map((t) => ({ slug: t.slug }));
};

export const prerender = true;
