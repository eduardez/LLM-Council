<script lang="ts">
	import { IconArrowLeft, IconTrash } from '@tabler/icons-svelte';

	interface SavedSession {
		id: number;
		question: string;
		timestamp: number;
		seated: number[];
		speeches: Array<{ name: string; speech: string; personaId: number }>;
		reviews: Array<{
			name: string;
			review: string;
			scores: Array<{ name: string; score: number }>;
		}>;
		synthesis: string;
	}

	interface Props {
		isVisible: boolean;
		restoreSession: (data: SavedSession) => void;
		closePage: () => void;
	}

	let { isVisible, restoreSession, closePage }: Props = $props();
	let history = $state<SavedSession[]>([]);

	$effect(() => {
		if (isVisible) loadHistory();
	});

	function loadHistory() {
		try {
			const saved = localStorage.getItem('council_sessions');
			if (saved) {
				history = JSON.parse(saved);
			}
		} catch {}
	}

	function handleSelect(entry: SavedSession) {
		closePage();
		setTimeout(() => restoreSession(entry), 400);
	}

	function clearHistory() {
		history = [];
		localStorage.removeItem('council_sessions');
	}

	function formatDate(ts: number): string {
		const d = new Date(ts);
		const diff = Date.now() - ts;
		if (diff < 60000) return 'Just now';
		if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
		if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
		return d.toLocaleDateString();
	}
</script>

<div
	class="absolute inset-3 top-18 z-[3] flex flex-col rounded-2xl bg-parchment shadow-2xl shadow-ink/15 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
	class:invisible={!isVisible}
	style="transform: {isVisible ? 'translateY(0)' : 'translateY(100%)'};"
>
	<div class="flex-1 overflow-y-auto px-4 pt-[22px] pb-3.5 sm:px-[22px]">
		<div class="mb-2 flex flex-wrap items-center justify-between gap-2">
			<button
				class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
				onclick={closePage}
			>
				<IconArrowLeft size={16} stroke={1.5} />
				<span>Council</span>
			</button>
			<div
				class="font-serif text-lg font-normal text-ink sm:text-[21px]"
				style="font-family: 'Cinzel Decorative', serif;"
			>
				Past questions
			</div>
		</div>

		{#if history.length > 0}
			<div class="flex flex-col gap-2">
				{#each history as entry, i (entry.id)}
					<button
						class="group flex cursor-pointer items-start gap-3 rounded-lg border border-parchment-3 bg-parchment-2 p-3 text-left transition-all duration-150 hover:border-gold-2 hover:bg-parchment"
						onclick={() => handleSelect(entry)}
					>
						<span class="mt-0.5 flex-shrink-0 text-sm text-ink-3">{i + 1}.</span>
						<div class="min-w-0 flex-1">
							<div class="truncate text-sm leading-relaxed text-ink">{entry.question}</div>
							<div class="mt-1 text-[11px] text-ink-3 italic">{formatDate(entry.timestamp)}</div>
						</div>
						<span
							class="mt-0.5 flex-shrink-0 text-xs text-gold opacity-0 transition-opacity group-hover:opacity-100"
							>→</span
						>
					</button>
				{/each}
			</div>

			<button
				class="mt-4 flex cursor-pointer items-center gap-1.5 text-xs text-burgundy transition-colors hover:text-burgundy/80"
				onclick={clearHistory}
			>
				<IconTrash size={14} stroke={1.5} />
				Clear all history
			</button>
		{:else}
			<div class="mt-8 text-center">
				<div class="mb-2 text-3xl text-ink-3">📜</div>
				<div class="text-sm text-ink-3 italic">No past questions yet.</div>
				<div class="mt-1 text-xs text-ink-3">Questions asked to the Council will appear here.</div>
			</div>
		{/if}
	</div>

	<div class="px-4 pb-4 sm:px-[22px]">
		<button
			class="btn-shimmer relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-parchment-4 py-3 text-sm text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			onclick={closePage}
		>
			<IconArrowLeft size={18} stroke={1.5} />
			<span>Back to the Council</span>
		</button>
	</div>
</div>
