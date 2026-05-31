export interface TutorialEntry {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string[];
	keywords: string[];
}

export const TUTORIALS: TutorialEntry[] = [];

export function getTutorial(slug: string): TutorialEntry | undefined {
	return TUTORIALS.find((t) => t.slug === slug);
}

export function getTutorialsByTag(tag: string): TutorialEntry[] {
	return TUTORIALS.filter((t) => t.tags.includes(tag));
}
