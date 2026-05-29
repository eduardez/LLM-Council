import { streamText, type LanguageModel } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export interface CouncilConfig {
	provider: 'openrouter' | 'openai' | 'anthropic' | 'google' | 'custom';
	endpoint: string;
	token: string;
	model: string;
	headers?: Record<string, string>;
}

export interface Persona {
	id: number;
	name: string;
	role: string;
	prompt: string;
}

export interface Speech {
	name: string;
	speech: string;
	personaId: number;
}

export interface Review {
	name: string;
	review: string;
	scores: Array<{ name: string; score: number }>;
}

export function createProvider(config: CouncilConfig): LanguageModel {
	const apiKey = config.token;
	const baseURL = config.endpoint;
	const headers = config.headers || {};

	switch (config.provider) {
		case 'openrouter': {
			const provider = createOpenAICompatible({
				name: 'openrouter',
				apiKey,
				baseURL,
				headers: {
					'HTTP-Referer': 'https://council.eduard3v.com',
					'X-Title': 'LLM Council',
					...headers
				}
			});
			return provider.languageModel(config.model);
		}

		case 'custom': {
			const provider = createOpenAICompatible({
				name: 'custom',
				apiKey,
				baseURL,
				headers
			});
			return provider.languageModel(config.model);
		}

		case 'openai': {
			const openaiProvider = createOpenAI({ apiKey, baseURL });
			return openaiProvider(config.model);
		}

		case 'anthropic': {
			const anthropicProvider = createAnthropic({ apiKey, baseURL });
			return anthropicProvider(config.model);
		}

		case 'google': {
			const googleProvider = createGoogleGenerativeAI({ apiKey, baseURL });
			return googleProvider(config.model);
		}

		default:
			throw new Error(`Unknown provider: ${config.provider}`);
	}
}

export async function streamSpeech(
	config: CouncilConfig,
	persona: Persona,
	question: string
): Promise<AsyncIterable<string>> {
	try {
		const model = createProvider(config);
		const result = streamText({
			model,
			system: `${persona.prompt}\n\nSpeak in character. Keep concise (2-4 sentences).`,
			prompt: `Council question: "${question}"`
		});
		return result.textStream;
	} catch (error) {
		console.error(`[streamSpeech] Error for persona ${persona.name}:`, error);
		return fallbackStream(`[Error: Could not reach council - ${persona.name} is unavailable]`);
	}
}

export async function streamReview(
	config: CouncilConfig,
	persona: Persona,
	speeches: Speech[]
	// question parameter reserved for future context use
): Promise<AsyncIterable<string>> {
	try {
		const anonymizedSpeeches = speeches
			.map((s, i) => `Speaker ${String.fromCharCode(65 + i)}: ${s.speech}`)
			.join('\n\n');

		const model = createProvider(config);
		const result = streamText({
			model,
			system: persona.prompt,
			prompt: `Review these anonymized speeches. Rank the top 3 by insight and accuracy. Rate each 0-100.\n\n${anonymizedSpeeches}`
		});
		return result.textStream;
	} catch (error) {
		console.error(`[streamReview] Error for persona ${persona.name}:`, error);
		return fallbackStream(`[Error: Could not reach council - ${persona.name} review failed]`);
	}
}

export async function streamSynthesis(
	config: CouncilConfig,
	question: string,
	speeches: Speech[],
	reviews: Review[]
): Promise<AsyncIterable<string>> {
	try {
		const speechesText = speeches.map((s) => `${s.name}: ${s.speech}`).join('\n\n');

		const reviewsText = reviews.map((r) => `${r.name}'s Review:\n${r.review}`).join('\n\n');

		const model = createProvider(config);
		const result = streamText({
			model,
			system:
				'You are The Council Scribe. Synthesize perspectives into a unified response (3-5 sentences).',
			prompt: `Question: "${question}"\n\nSpeeches:\n${speechesText}\n\nReviews:\n${reviewsText}\n\nSynthesize the above into a unified, balanced response.`
		});
		return result.textStream;
	} catch (error) {
		console.error('[streamSynthesis] Error:', error);
		return fallbackStream('[Error: Could not reach council - Synthesis failed]');
	}
}

async function* fallbackStream(message: string): AsyncIterable<string> {
	yield message;
}
