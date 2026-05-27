import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { persona, councilSession } from '$lib/server/db/schema';
import { generatePersonaSpeech, generateSynthesis } from '$lib/server/llm';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { question, personaIds, config } = body;

		if (!question || !personaIds || !Array.isArray(personaIds) || personaIds.length === 0) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Save session to history
		db.insert(councilSession).values({ question }).run();

		// Fetch personas
		const personas = personaIds
			.map((id: number) => {
				const p = db.select().from(persona).where(eq(persona.id, id)).get();
				return p;
			})
			.filter(Boolean);

		// Generate speeches sequentially
		const speeches: Array<{ name: string; speech: string; personaId: number }> = [];
		const previousSpeeches: string[] = [];

		for (const p of personas) {
			if (!p) continue;

			// If no config provided, return mock data for demo
			if (!config?.token) {
				const mockSpeeches = [
					'The evidence is clear enough. We keep mistaking urgency for priority — climate adaptation and institutional trust are compounding problems that make every other goal harder to pursue if left unaddressed.',
					"If I were designing the next decade from scratch, I'd build for reversibility. Most catastrophic failures come from irreversible lock-in. Distributed infrastructure, open standards, graceful failure modes.",
					'Every major transition in history has left people behind — not by accident but by design. We need to ask not just what we build, but who holds the door open. Care infrastructure matters as much as hard infrastructure.',
					"Everyone here assumes continuity. I'd argue the premise is broken: 'prioritise' implies a coherent actor with stable will. We don't have one. What looks like planning is mostly rationalised drift.",
					'The natural world operates on cycles of millennia. Our decade-thinking is a rounding error. The question should be: what do we stop doing?',
					'From first principles — consciousness, coordination, energy. Fix the energy problem and you unlock twenty others. Everything else is downstream.',
					'The data is unambiguous on two things: pandemic preparedness and democratic erosion are the most underfunded tail risks. Everything else is secondary.',
					'The last century shows a clear pattern: technological acceleration without cultural integration ends in rupture. We are in the lag phase right now.'
				];

				const speech = mockSpeeches[speeches.length % mockSpeeches.length];
				speeches.push({
					name: p.name,
					speech,
					personaId: p.id
				});
				previousSpeeches.push(`${p.name}: ${speech}`);
				continue;
			}

			try {
				const speech = await generatePersonaSpeech(config, p, question, previousSpeeches);
				speeches.push({
					name: p.name,
					speech,
					personaId: p.id
				});
				previousSpeeches.push(`${p.name}: ${speech}`);
			} catch (error) {
				console.error(`Error generating speech for ${p.name}:`, error);
				speeches.push({
					name: p.name,
					speech: `[Error: Could not generate response]`,
					personaId: p.id
				});
			}
		}

		// Generate synthesis
		let synthesis = '';
		if (config?.token) {
			try {
				synthesis = await generateSynthesis(
					config,
					question,
					speeches.map((s) => ({ name: s.name, speech: s.speech }))
				);
			} catch (error) {
				console.error('Error generating synthesis:', error);
				synthesis = 'The council has spoken, but the scribe could not complete the synthesis.';
			}
		} else {
			synthesis =
				"The council's voices converge on a difficult truth: urgency and priority are not the same thing. The Pragmatist and Scientist both point to compounding, underfunded risks — institutional erosion, pandemic preparedness, climate adaptation — as the structural substrate beneath every other ambition. The Builder and Visionary urge we design for reversibility and first principles rather than incremental extension of current systems. The Empath reminds us that transitions without care infrastructure produce the next wave of crises. Even the Contrarian's challenge is useful: it forces us to ask whether 'prioritise' assumes a coherence of human agency we do not yet possess. The synthesis, then, is not a ranked list but a method: invest in reversibility, repair institutional trust, and never mistake the speed of innovation for the readiness of people to inhabit it.";
		}

		return json({
			speeches,
			synthesis,
			question
		});
	} catch (error) {
		console.error('Session error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
