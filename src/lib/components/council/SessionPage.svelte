<script lang="ts">
	import { streamSpeech, streamReview, streamSynthesis } from '$lib/ai/council';
	import type { CouncilConfig, Persona as AIPersona, Speech, Review } from '$lib/ai/council';
	import { IconArrowLeft } from '@tabler/icons-svelte';

	interface Persona {
		id: number;
		glyph: string;
		name: string;
		role: string;
		prompt: string;
	}

	interface Props {
		question: string;
		personas: Persona[];
		seated: number[];
		sessionData: {
			question: string;
			speeches: Speech[];
			reviews: Review[];
			synthesis: string;
		} | null;
		setSessionData: (data: Props['sessionData']) => void;
		isVisible: boolean;
		closePage: () => void;
	}

	let { question, personas, seated, sessionData, setSessionData, isVisible, closePage }: Props =
		$props();

	let stage = $state<'speeches' | 'reviews' | 'synthesis' | 'complete'>('speeches');
	let speeches = $state<
		Array<{ name: string; speech: string; personaId: number; streaming: boolean }>
	>([]);
	let reviews = $state<
		Array<{
			name: string;
			text: string;
			scores: Array<{ name: string; score: number }>;
			streaming: boolean;
		}>
	>([]);
	let synthesis = $state('');
	let displayedSynthesis = $state('');
	let error = $state('');
	let scrollRef = $state<HTMLDivElement | null>(null);
	let isLoading = $state(false);

	const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

	let abortController: AbortController | null = null;

	let voteData = $derived(getVoteData());

	// Start or restore session when visible
	$effect(() => {
		if (!isVisible) return;

		if (sessionData) {
			if (speeches.length === 0) {
				speeches = sessionData.speeches.map((s) => ({
					name: s.name,
					speech: s.speech,
					personaId: s.personaId,
					streaming: false
				}));
				reviews = sessionData.reviews.map((r) => ({
					name: r.name,
					text: r.review,
					scores: r.scores,
					streaming: false
				}));
				synthesis = sessionData.synthesis;
				displayedSynthesis = sessionData.synthesis;
				stage = 'complete';
			}
		} else if (!isLoading) {
			startSessionFlow();
		}
	});

	// Abort streams when hidden
	$effect(() => {
		if (!isVisible) {
			abortController?.abort();
			abortController = null;
		}
	});

	async function startSessionFlow() {
		// Reset state
		stage = 'speeches';
		speeches = [];
		reviews = [];
		synthesis = '';
		displayedSynthesis = '';
		error = '';
		isLoading = true;
		abortController = new AbortController();

		try {
			const configRaw = localStorage.getItem('council_cfg_v2');
			if (!configRaw) {
				throw new Error('Please configure your API key in Settings');
			}
			const config: CouncilConfig = JSON.parse(configRaw);
			if (!config.token) {
				throw new Error('Please configure your API key in Settings');
			}

			const activePersonas = seated
				.map((id) => personas.find((p) => p.id === id))
				.filter(Boolean) as Persona[];

			if (activePersonas.length === 0) {
				throw new Error('No personas seated');
			}

			// Stage 1: Speeches
			stage = 'speeches';
			speeches = activePersonas.map((p) => ({
				name: p.name,
				speech: '',
				personaId: p.id,
				streaming: true
			}));

			await Promise.all(
				activePersonas.map(async (persona, index) => {
					try {
						const stream = await streamSpeech(config, persona as AIPersona, question);
						for await (const chunk of stream) {
							if (abortController?.signal.aborted) break;
							speeches[index].speech += chunk;
						}
					} catch {
						speeches[index].speech = '[Error: Could not reach council]';
					} finally {
						speeches[index].streaming = false;
					}
				})
			);

			if (abortController?.signal.aborted) return;

			// Stage 2: Reviews
			stage = 'reviews';
			const speechData: Speech[] = speeches.map((s) => ({
				name: s.name,
				speech: s.speech,
				personaId: s.personaId
			}));

			reviews = activePersonas.map((p) => ({
				name: p.name,
				text: '',
				scores: [],
				streaming: true
			}));

			await Promise.all(
				activePersonas.map(async (persona, index) => {
					try {
						const stream = await streamReview(config, persona as AIPersona, speechData);
						for await (const chunk of stream) {
							if (abortController?.signal.aborted) break;
							reviews[index].text += chunk;
						}
					} catch {
						reviews[index].text = '[Error: Could not reach council]';
					} finally {
						reviews[index].streaming = false;
						reviews[index].scores = parseScoresFromReview(reviews[index].text);
					}
				})
			);

			if (abortController?.signal.aborted) return;

			// Stage 3: Synthesis
			stage = 'synthesis';
			const reviewData: Review[] = reviews.map((r) => ({
				name: r.name,
				review: r.text,
				scores: r.scores
			}));

			try {
				const stream = await streamSynthesis(config, question, speechData, reviewData);
				for await (const chunk of stream) {
					if (abortController?.signal.aborted) break;
					synthesis += chunk;
					displayedSynthesis += chunk;
				}
			} catch {
				synthesis = '[Error: Could not reach council - Synthesis failed]';
				displayedSynthesis = synthesis;
			}

			if (abortController?.signal.aborted) return;

			stage = 'complete';
			setSessionData({
				question,
				speeches: speechData,
				reviews: reviewData,
				synthesis
			});
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			isLoading = false;
		}
	}

	function parseScoresFromReview(text: string): Array<{ name: string; score: number }> {
		const scores: Array<{ name: string; score: number }> = [];
		// Try "Speaker A: 85" pattern
		const regex = /[Ss]peaker\s*([A-Z])[:\s]+(\d{1,3})/g;
		let match;
		while ((match = regex.exec(text)) !== null) {
			const speakerIndex = match[1].charCodeAt(0) - 65;
			const score = parseInt(match[2], 10);
			if (speakerIndex >= 0 && speakerIndex < speeches.length && score >= 0 && score <= 100) {
				scores.push({ name: speeches[speakerIndex].name, score });
			}
		}
		// Fallback: extract any numbers 0-100
		if (scores.length === 0) {
			const numRegex = /\b(\d{1,3})\b/g;
			let numMatch;
			let speakerIdx = 0;
			while ((numMatch = numRegex.exec(text)) !== null && speakerIdx < speeches.length) {
				const score = parseInt(numMatch[1], 10);
				if (score >= 0 && score <= 100) {
					scores.push({ name: speeches[speakerIdx].name, score });
					speakerIdx++;
				}
			}
		}
		return scores;
	}

	function getVoteData(): Array<{ name: string; score: number }> {
		const activePersonas = seated
			.map((id) => personas.find((p) => p.id === id))
			.filter(Boolean) as Persona[];

		const scoresMap: Record<string, number[]> = {};

		for (const review of reviews) {
			for (const score of review.scores) {
				if (!scoresMap[score.name]) {
					scoresMap[score.name] = [];
				}
				scoresMap[score.name].push(score.score);
			}
		}

		const result = activePersonas.map((p) => {
			const scores = scoresMap[p.name] || [];
			const avgScore =
				scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 50;
			return { name: p.name, score: avgScore };
		});

		return result.sort((a, b) => b.score - a.score);
	}

	$effect(() => {
		const speechContents = speeches.map((s) => s.speech).join('');
		const reviewContents = reviews.map((r) => r.text).join('');
		const synthContent = displayedSynthesis;

		void speechContents;
		void reviewContents;
		void synthContent;

		requestAnimationFrame(() => {
			if (scrollRef) {
				const threshold = 80;
				const atBottom =
					scrollRef.scrollHeight - scrollRef.scrollTop - scrollRef.clientHeight < threshold;
				if (atBottom) {
					scrollRef.scrollTop = scrollRef!.scrollHeight;
				}
			}
		});
	});
</script>

<div
	class="absolute inset-3 top-18 z-[3] flex flex-col rounded-2xl bg-parchment shadow-2xl shadow-ink/15 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
	class:invisible={!isVisible}
	style="transform: {isVisible ? 'translateY(0)' : 'translateY(100%)'};"
>
	<div bind:this={scrollRef} class="flex-1 overflow-y-auto px-4 pt-5 pb-4 sm:px-[22px]">
		<div class="mb-4 border-b border-parchment-3 pb-3">
			<div class="flex items-center justify-between">
				<button
					class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
					onclick={closePage}
				>
					<IconArrowLeft size={16} stroke={1.5} />
					<span>Council</span>
				</button>
				<div class="font-serif text-base text-ink" style="font-family: 'Playfair Display', serif;">
					Council in session
				</div>
			</div>
			<div
				class="mt-[3px] overflow-hidden text-xs text-ellipsis whitespace-nowrap text-ink-3 italic"
			>
				› {question}
			</div>
		</div>

		{#if error}
			<div
				class="mb-4 rounded-lg border border-burgundy/30 bg-burgundy/10 p-4 text-sm text-burgundy"
			>
				{error}
			</div>
		{/if}

		<!-- Podiums -->
		<div class="mb-3 flex flex-col gap-[9px]">
			{#each speeches as speech, i (i)}
				{@const persona = personas.find((p) => p.id === speech.personaId)}
				{#if persona}
					<div
						class="overflow-hidden rounded-lg border border-parchment-3 bg-parchment-2 transition-all duration-250"
						class:border-gold-2={speech.streaming}
						class:bg-parchment={speech.streaming}
					>
						<div
							class="flex items-center gap-2.5 border-b border-parchment-3 px-[13px] py-2"
							class:bg-gold-3={speech.streaming}
						>
							<div
								class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gold-2 bg-gold-3 text-[13px]"
							>
								{persona.glyph}
							</div>
							<div>
								<div
									class="font-serif text-[13px] font-medium text-ink"
									style="font-family: 'Playfair Display', serif;"
								>
									{persona.name}
								</div>
								<div class="text-[10px] text-ink-3">{persona.role}</div>
							</div>
							<span
								class="ml-auto rounded-[10px] px-[7px] py-[2px] text-[10px]"
								class:bg-parchment-3={!speech.streaming && speech.speech === ''}
								class:text-ink-3={!speech.streaming && speech.speech === ''}
								class:bg-gold-3={speech.streaming}
								class:text-gold={speech.streaming}
								class:bg-[#e8f0e8]={speech.speech !== '' && !speech.streaming}
								class:text-sage={speech.speech !== '' && !speech.streaming}
							>
								{#if speech.streaming}
									Speaking…
								{:else if speech.speech === ''}
									Waiting
								{:else}
									Done
								{/if}
							</span>
						</div>
						<div class="min-h-[32px] px-[13px] py-2.5 text-[13px] leading-relaxed text-ink-2">
							{#if speech.speech === '' && !speech.streaming}
								<!-- Empty -->
							{:else if speech.speech === '' && speech.streaming}
								<div class="mb-1.5 h-[3px] overflow-hidden rounded-sm bg-parchment-3">
									<div class="h-full animate-[shimmer_1.2s_ease_forwards] bg-gold-2"></div>
								</div>
								<div
									class="animate-[fadeRoman_0.4s_ease_forwards] font-serif text-xl tracking-[8px] text-gold-2"
									style="font-family: 'Playfair Display', serif;"
								>
									{romans[i] || ''}
								</div>
							{:else}
								{speech.speech}
								{#if speech.streaming}
									<span
										class="ml-[1px] inline-block h-3 w-[2px] animate-[blink_0.75s_infinite] bg-gold align-[-2px]"
									></span>
								{/if}
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Deliberating -->
		{#if stage === 'reviews' && reviews.some((r) => r.streaming)}
			<div class="mb-3 rounded-lg border border-parchment-3 bg-parchment p-[13px] text-center">
				<div
					class="font-serif text-[13px] text-ink-3 italic"
					style="font-family: 'Playfair Display', serif;"
				>
					Council deliberating…
				</div>
			</div>
		{/if}

		<!-- Votes -->
		{#if (stage === 'reviews' || stage === 'synthesis' || stage === 'complete') && reviews.length > 0}
			<div class="rounded-lg border border-parchment-3 bg-parchment p-[13px]">
				<div
					class="mb-2.5 font-serif text-[13px] text-ink"
					style="font-family: 'Playfair Display', serif;"
				>
					The assembly has deliberated — peer rankings
				</div>
				{#each voteData as vote, i (i)}
					<div class="relative mb-[9px] flex items-center gap-2.5">
						<div
							class="w-[88px] overflow-hidden text-xs text-ellipsis whitespace-nowrap text-ink-2"
						>
							{vote.name}
						</div>
						<div class="relative h-[7px] flex-1 overflow-hidden rounded-sm bg-parchment-3">
							<div
								class="h-full rounded-sm bg-gold-2 transition-all duration-700 ease-out"
								style="width: {vote.score + '%'}"
							></div>
						</div>
						<div
							class="min-w-[32px] text-right font-serif text-xs text-gold"
							style="font-family: 'Playfair Display', serif;"
						>
							{vote.score}{i === 0 ? ' 👑' : ''}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Synthesis -->
		{#if stage === 'synthesis' || stage === 'complete'}
			<div class="mt-2.5 rounded-lg border border-gold-2 bg-parchment p-3.5">
				<div class="mb-2.5 flex items-center gap-2.5 border-b border-parchment-3 pb-2.5">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border border-gold bg-gold-3 text-[15px]"
					>
						📖
					</div>
					<div>
						<div
							class="font-serif text-[13px] text-ink"
							style="font-family: 'Playfair Display', serif;"
						>
							The Council Scribe
						</div>
						<div class="text-[11px] text-ink-3">Unified synthesis of all voices</div>
					</div>
					<span class="ml-auto rounded-[10px] bg-gold-3 px-2 py-[2px] text-[10px] text-gold italic"
						>Final word</span
					>
				</div>
				<div class="text-[13px] leading-relaxed text-ink-2 italic">
					{displayedSynthesis}
					{#if stage === 'synthesis'}
						<span
							class="ml-[1px] inline-block h-3 w-[2px] animate-[blink_0.75s_infinite] bg-gold align-[-2px]"
						></span>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div class="px-4 pb-4 sm:px-[22px]">
		<button
			class="btn-shimmer relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-parchment-4 py-3 text-sm text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			onclick={closePage}
		>
			<IconArrowLeft size={18} stroke={1.5} />
			<span>Conclude audience</span>
		</button>
	</div>
</div>

<style>
	@keyframes blink {
		0%,
		49% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}

	@keyframes fadeRoman {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes shimmer {
		0% {
			width: 0%;
		}
		100% {
			width: 100%;
		}
	}
</style>
