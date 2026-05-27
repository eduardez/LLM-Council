// LLM service for council sessions

interface LLMConfig {
	endpoint: string;
	token: string;
	model: string;
}

interface Message {
	role: string;
	content: string;
}

export async function callLLM(config: LLMConfig, messages: Message[]): Promise<string> {
	const { endpoint, token, model } = config;

	// Default to Anthropic Claude API format
	const isAnthropic = endpoint.includes('anthropic');
	const isOpenAI = endpoint.includes('openai');

	if (isAnthropic) {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': token,
				'anthropic-version': '2023-06-01'
			},
			body: JSON.stringify({
				model: model || 'claude-3-5-sonnet-20241022',
				max_tokens: 1024,
				messages
			})
		});

		if (!response.ok) {
			throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.content[0]?.text || '';
	}

	if (isOpenAI) {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				model: model || 'gpt-4o',
				messages
			})
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data.choices[0]?.message?.content || '';
	}

	// Generic API format (fallback)
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			model: model || 'default',
			messages
		})
	});

	if (!response.ok) {
		throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	return data.choices?.[0]?.message?.content || data.content?.[0]?.text || JSON.stringify(data);
}

export async function generatePersonaSpeech(
	config: LLMConfig,
	persona: {
		name: string;
		prompt: string;
		role: string;
	},
	question: string,
	previousSpeeches?: string[]
): Promise<string> {
	const context = previousSpeeches?.length
		? `Previous council members have said:\n\n${previousSpeeches.join('\n\n')}\n\nNow it's your turn to respond to the question, building on or challenging what has been said.`
		: 'You are the first to speak. Set the tone for the discussion.';

	const messages: Message[] = [
		{
			role: 'system',
			content: `${persona.prompt}\n\nYou are participating in a council deliberation. Speak in character as ${persona.name}, ${persona.role}. Keep your response concise (2-4 sentences). Be thoughtful and distinctive.`
		},
		{
			role: 'user',
			content: `The council is deliberating on this question: "${question}"\n\n${context}\n\nWhat is your perspective?`
		}
	];

	return callLLM(config, messages);
}

export async function generateSynthesis(
	config: LLMConfig,
	question: string,
	speeches: Array<{ name: string; speech: string }>
): Promise<string> {
	const speechesText = speeches.map((s) => `${s.name}: ${s.speech}`).join('\n\n');

	const messages: Message[] = [
		{
			role: 'system',
			content:
				'You are The Council Scribe. Your role is to synthesize multiple perspectives into a unified, thoughtful response. Identify convergences, tensions, and emergent insights. Write in an elegant, concise style (3-5 sentences).'
		},
		{
			role: 'user',
			content: `The council deliberated on: "${question}"\n\nHere are the perspectives:\n\n${speechesText}\n\nProvide a unified synthesis that captures the essence of the discussion.`
		}
	];

	return callLLM(config, messages);
}
