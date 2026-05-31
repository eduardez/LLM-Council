export interface TutorialEntry {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string[];
	keywords: string[];
}

export const TUTORIALS: TutorialEntry[] = [
	{
		slug: 'getting-started-with-llm-council',
		title: 'Getting Started with LLM Council — AI Deliberation Tutorial',
		description:
			'Learn how to get started with LLM Council, the AI deliberation tool for multi-model debate. Configure providers, choose personas, and run your first council session.',
		date: '2026-05-31',
		tags: ['beginner', 'guide'],
		keywords: [
			'AI deliberation tool tutorial',
			'LLM Council getting started',
			'multi-model AI debate'
		]
	}
];

export function getTutorial(slug: string): TutorialEntry | undefined {
	return TUTORIALS.find((t) => t.slug === slug);
}

export function getTutorialsByTag(tag: string): TutorialEntry[] {
	return TUTORIALS.filter((t) => t.tags.includes(tag));
}
