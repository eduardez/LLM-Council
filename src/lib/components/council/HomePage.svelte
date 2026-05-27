<script lang="ts">
	import { IconHistory } from '@tabler/icons-svelte';

	interface Persona {
		id: number;
		glyph: string;
		name: string;
		role: string;
		tag: string;
		tagBg: string;
		tagColor: string;
		spine: string;
		quote: string;
		conflicts: string;
		prompt: string;
	}

	interface Props {
		personas: Persona[];
		seated: number[];
		reorderSeats: (from: number, to: number) => void;
		openPage: (page: string) => void;
		startSession: (question: string) => void;
		isVisible: boolean;
	}

	let { personas, seated, reorderSeats, openPage, startSession, isVisible }: Props = $props();

	let promptValue = $state('');
	let isFocused = $state(false);
	let dragSrc = $state<number | null>(null);
	let promptIdx = $state(0);
	let promptInterval: ReturnType<typeof setInterval> | null = null;

	const prompts = [
		'What should humanity prioritise in the next decade?',
		'Is genuine consensus ever possible, or only the illusion of it?',
		'What does progress actually mean when measured in centuries?',
		'Which human instinct causes the most unnecessary suffering?',
		'Can a society be both free and equal — or must it choose?'
	];

	$effect(() => {
		if (isVisible) {
			promptInterval = setInterval(() => {
				if (!promptValue && !isFocused) {
					promptIdx = (promptIdx + 1) % prompts.length;
				}
			}, 2800);
			return () => {
				if (promptInterval) clearInterval(promptInterval);
			};
		}
	});

	function getConflicts() {
		const pairs: [number, number][] = [];
		for (let a = 0; a < seated.length; a++) {
			for (let b = a + 1; b < seated.length; b++) {
				const personaA = personas.find((p) => p.id === seated[a]);
				if (personaA) {
					const conflicts = JSON.parse(personaA.conflicts || '[]');
					if (conflicts.includes(seated[b])) {
						pairs.push([a, b]);
					}
				}
			}
		}
		return pairs;
	}

	function getConflictedPositions() {
		const conflicts = getConflicts();
		return new Set(conflicts.flatMap((p) => p));
	}

	function handleDragStart(e: DragEvent, pos: number) {
		dragSrc = pos;
		(e.currentTarget as HTMLElement).classList.add('opacity-50');
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		(e.currentTarget as HTMLElement).classList.add('border-gold', 'bg-gold-3');
	}

	function handleDragLeave(e: DragEvent) {
		(e.currentTarget as HTMLElement).classList.remove('border-gold', 'bg-gold-3');
	}

	function handleDrop(e: DragEvent, pos: number) {
		e.preventDefault();
		(e.currentTarget as HTMLElement).classList.remove('border-gold', 'bg-gold-3');
		if (dragSrc !== null && dragSrc !== pos && dragSrc < seated.length && pos < seated.length) {
			reorderSeats(dragSrc, pos);
		}
		dragSrc = null;
		document.querySelectorAll('.seat').forEach((s) => s.classList.remove('opacity-50'));
	}

	function handleConvene() {
		const q = promptValue.trim() || prompts[promptIdx];
		startSession(q);
	}

	const conflictedPositions = $derived(getConflictedPositions());
	const slots = $derived(
		Array(Math.min(Math.max(seated.length + 1, 3), 12))
			.fill(null)
			.map((_, i) => seated[i] ?? null)
	);
</script>

<div class="absolute inset-0 z-[1] flex flex-col overflow-y-auto bg-parchment pb-24">
	<div class="flex flex-1 flex-col px-4 pt-7 pb-4 sm:px-7">
		<div
			class="mb-1 text-center font-serif text-[22px] font-normal text-ink sm:text-[28px]"
			style="font-family: 'Cinzel Decorative', serif;"
		>
			The <em class="text-gold not-italic">Council</em>
		</div>
		<div class="mb-3 text-center text-[11px] text-ink-3 italic sm:mb-4 sm:text-xs">
			A chamber of minds. One question. Many voices.
		</div>
		<div class="mb-[14px] text-center text-xs tracking-[4px] text-gold-2 sm:mb-[18px] sm:text-sm sm:tracking-[6px]">· · ✦ · ·</div>

		<!-- Seats -->
		<div
			class="mb-2 flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] text-ink-3 uppercase"
		>
			Council
			<span class="text-[10px] font-normal tracking-normal text-ink-3 normal-case italic">
				drag to set speaking order
			</span>
		</div>
		<div class="relative mb-[18px]">
			<div class="flex min-h-[80px] flex-nowrap items-end gap-2 overflow-x-auto pb-1 pt-5">
				{#each slots as idx, pos (pos)}
					{#if idx !== null}
						{@const m = personas.find((p) => p.id === idx)}
						{#if m}
							<div
								class="seat relative flex cursor-grab flex-col items-center gap-1 transition-transform duration-150 select-none"
								role="button"
								tabindex="0"
								aria-label="Drag to reorder {m.name}"
								draggable="true"
								data-pos={pos}
								ondragstart={(e) => handleDragStart(e, pos)}
								ondragover={handleDragOver}
								ondragleave={handleDragLeave}
								ondrop={(e) => handleDrop(e, pos)}
							>
								<div
									class="relative flex h-[56px] w-[56px] items-center justify-center rounded-full border-2 border-parchment-3 bg-parchment-2 text-[24px] transition-all duration-200"
									class:border-gold-2={true}
									class:bg-gold-3={true}
								>
									{m.glyph}
									<span
										class="absolute -top-[6px] -right-[6px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold font-serif text-[10px] text-parchment"
										style="font-family: 'Cinzel Decorative', serif;"
									>
										{pos + 1}
									</span>
								</div>
								<div
									class="w-[60px] overflow-hidden text-center text-[10px] text-ellipsis whitespace-nowrap text-ink-2"
								>
									{m.name.replace('The ', '')}
								</div>
								{#if conflictedPositions.has(pos)}
									<div
										class="absolute bottom-[2px] left-1/2 -translate-x-1/2 text-[9px] text-burgundy opacity-70"
									>
										⚡
									</div>
								{/if}
								<!-- Tooltip -->
								<div
									class="pointer-events-none absolute bottom-[60px] left-1/2 z-20 w-[160px] -translate-x-1/2 scale-[0.85] rounded-lg border border-gold-2 bg-parchment px-3 py-2.5 opacity-0 shadow-[0_2px_12px_rgba(44,36,22,0.10)] transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
									style="transform-origin: bottom center;"
								>
									<div
										class="mb-1 font-serif text-xs text-ink"
										style="font-family: 'Cinzel Decorative', serif;"
									>
										{m.name}
									</div>
									<div class="text-[11px] leading-relaxed text-ink-3 italic">{m.quote}</div>
									<div
										class="absolute -bottom-[5px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-gold-2 bg-parchment"
									></div>
								</div>
							</div>
						{/if}
					{:else}
						<div class="flex flex-col items-center gap-1">
							<button
								class="flex h-[56px] w-[56px] items-center justify-center rounded-full border-2 border-dashed border-parchment-4 bg-transparent text-2xl text-ink-3 transition-all duration-200 hover:border-gold-2 hover:text-gold"
								onclick={() => openPage('catalog')}
							>
								+
							</button>
							<div class="w-[60px] text-center text-[10px] text-ink-3">Add</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Prompt -->
		<div class="mb-2 text-[11px] font-medium tracking-[0.1em] text-ink-3 uppercase">
			Your question
		</div>
		<div class="relative mb-2.5 flex min-h-0 flex-1 flex-col" class:focused={isFocused}>
			<span
				class="pointer-events-none absolute top-2.5 right-2.5 text-base text-ink-3 transition-opacity duration-200"
				class:opacity-30={isFocused}>✒</span
			>
			<textarea
				class="min-h-[60px] flex-1 w-full resize-none rounded-lg border border-parchment-3 bg-parchment-2 px-4 py-3 pr-9 text-sm leading-relaxed text-ink transition-all duration-200 outline-none placeholder:text-ink-3 placeholder:italic focus:border-gold-2 focus:bg-parchment"
				placeholder={prompts[promptIdx]}
				bind:value={promptValue}
				onfocus={() => {
					isFocused = true;
					if (promptInterval) clearInterval(promptInterval);
				}}
				onblur={() => {
					isFocused = false;
					if (!promptValue) {
						promptInterval = setInterval(() => {
							promptIdx = (promptIdx + 1) % prompts.length;
						}, 2800);
					}
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
						handleConvene();
					}
				}}
			></textarea>
		</div>

		<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
				<span class="text-[11px] text-ink-3 italic sm:text-xs">
					{seated.length} persona{seated.length !== 1 ? 's' : ''} seated{conflictedPositions.size
						? ' · ⚡ conflicts detected'
						: ''}
				</span>
				<button
					class="flex cursor-pointer items-center gap-1 text-[11px] text-ink-3 transition-colors duration-150 hover:text-gold sm:text-xs"
					onclick={() => openPage('history')}
				>
					<IconHistory size={13} />
					Past questions
				</button>
			</div>
			<button
				class="cursor-pointer rounded-lg border border-gold bg-gold px-5 py-2.5 text-sm tracking-wide text-parchment transition-all duration-200 hover:border-ink-2 hover:bg-ink-2 sm:px-[26px]"
				style="font-family: 'Cinzel Decorative', serif;"
				onclick={handleConvene}
			>
				Convene the council →
			</button>
		</div>
	</div>
</div>
