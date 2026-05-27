<script lang="ts">
	import { IconArrowLeft } from '@tabler/icons-svelte';

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
		prompt: string;
	}

	interface Props {
		personas: Persona[];
		seated: number[];
		toggleSeat: (id: number) => void;
		isVisible: boolean;
		closePage: () => void;
	}

	let { personas, seated, toggleSeat, isVisible, closePage }: Props = $props();
	let searchQuery = $state('');

	const filteredPersonas = $derived(
		personas.filter(
			(p) =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.role.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<div
	class="absolute inset-3 z-[3] flex flex-col top-18 rounded-2xl bg-parchment shadow-2xl shadow-ink/15 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
	class:invisible={!isVisible}
	style="transform: {isVisible ? 'translateY(0)' : 'translateY(100%)'};"
>
	<div class="flex-1 overflow-y-auto px-4 pt-[22px] pb-3.5 sm:px-[22px]">
		<div class="mb-4 flex items-center justify-between">
			<button
				class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
				onclick={closePage}
			>
				<IconArrowLeft size={16} stroke={1.5} />
				<span>Council</span>
			</button>
			<div class="flex items-center gap-2.5">
				<div
					class="font-serif text-[21px] font-normal text-ink"
					style="font-family: 'Cinzel Decorative', serif;"
				>
					Persona catalogue
				</div>
				<input
					type="text"
					placeholder="Search…"
					class="w-[155px] rounded-md border border-parchment-3 bg-parchment-2 px-3 py-[7px] text-xs text-ink outline-none focus:border-gold-2"
					bind:value={searchQuery}
				/>
			</div>
		</div>

		<div class="flex flex-row flex-wrap h-full justify-evenly gap-5 align-middle">
			{#each filteredPersonas as p (p.id)}
				<button
					class="persona-card group  min-w-64 relative cursor-pointer overflow-hidden rounded-[20px] border p-4 text-left transition-all duration-300"
					class:selected={seated.includes(p.id)}
					style="--spine: {p.spine};"
					onclick={() => toggleSeat(p.id)}
				>
					<div class="flex h-full flex-col">
						<div class="flex flex-1 items-center align-middle m-auto">
							<div
								class="persona-ribbon h-12 w-1 flex-shrink-0 rounded-full mr-2"
								style="background: {p.spine};"
							></div>

							<div class="min-w-0">
								<div class="flex items-center gap-2 name-row min-w-0">
									<div
										class="persona-title truncate text-[22px] leading-tight font-semibold text-ink"
										style="font-family: 'Cinzel Decorative', serif;"
									>
										{p.name}
									</div>
									<span class="selected-only flex-shrink-0 text-xl">{p.glyph}</span>
								</div>
							</div>
						</div>

						<div class="selected-collapse pb-1 text-[12px] leading-relaxed text-ink-3">
							{p.role}
						</div>
					</div>
				</button>
			{/each}
		</div>

		<div class="mt-3.5 flex items-center justify-between">
			<span class="text-xs text-ink-3 italic">{seated.length} of 12 seats filled</span>
		</div>
	</div>

	<div class="px-4 pb-4 sm:px-[22px]">
		<button
			class="btn-shimmer relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-parchment-4 py-3 text-sm text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			onclick={closePage}
		>
			<IconArrowLeft size={18} stroke={1.5} />
			<span>Return to the round</span>
		</button>
	</div>
</div>

<style>
	.persona-card {
		height: 150px;
		border-color: color-mix(in srgb, var(--color-parchment-4) 80%, transparent);
		background: transparent;
		box-shadow: none;
		color: var(--color-ink-3);
	}

	.persona-card:hover {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--color-gold) 35%, transparent);
		background: color-mix(in srgb, var(--color-parchment-2) 50%, transparent);
		box-shadow: 0 4px 12px color-mix(in srgb, var(--color-ink) 8%, transparent);
	}

	.persona-card.selected {
		border-color: color-mix(in srgb, var(--spine) 50%, transparent);
		background: color-mix(in srgb, var(--spine) 12%, transparent);
		box-shadow: 0 4px 16px color-mix(in srgb, var(--spine) 15%, transparent);
		transform: translateY(-3px);
	}

	.persona-card.selected .selected-collapse {
		opacity: 0;
		max-height: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.persona-card.selected .name-row {
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 4px;
		width: 100%;
	}

	.persona-card.selected .min-w-0 {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.persona-card.selected .flex.h-full {
		justify-content: center;
	}

	.persona-card.selected .persona-title {
		color: var(--color-ink);
	}

	.selected-only {
		display: none;
	}

	.persona-card.selected .selected-only {
		display: inline;
	}

	.persona-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, color-mix(in srgb, white 18%, transparent), transparent 34%);
		pointer-events: none;
		border-radius: inherit;
	}

	.persona-card::after {
		content: '';
		position: absolute;
		inset: 1px;
		border-radius: 19px;
		border: 1px solid color-mix(in srgb, white 20%, transparent);
		pointer-events: none;
	}

	.selected-collapse {
		transition:
			opacity 0.3s ease,
			max-height 0.3s ease,
			margin 0.3s ease,
			padding 0.3s ease;
		max-height: 200px;
		overflow: hidden;
	}

	.persona-ribbon {
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 35%, transparent);
		transition:
			width 0.3s ease,
			height 0.3s ease;
	}

	.persona-card.selected .persona-ribbon {
		width: 0;
		height: 0;
		opacity: 0;
		gap: 0;
		margin-right: 0;
	}

	.persona-title {
		letter-spacing: -0.02em;
	}
</style>
