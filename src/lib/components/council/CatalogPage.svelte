<script lang="ts">
	import { IconArrowLeft } from '@tabler/icons-svelte';
	import * as m from '$lib/paraglide/messages';

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
	class="absolute inset-3 top-18 z-[3] flex flex-col rounded-2xl bg-parchment shadow-2xl shadow-ink/15 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
	class:invisible={!isVisible}
	style="transform: {isVisible ? 'translateY(0)' : 'translateY(100%)'};"
>
	<div class="flex-1 overflow-y-auto px-4 pt-[22px] pb-3.5 sm:px-[22px]">
		<div class="mb-5 flex flex-wrap items-start justify-between gap-2">
			<button
				class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
				onclick={closePage}
			>
				<IconArrowLeft size={16} stroke={1.5} />
				<span>{m.catalog_back()}</span>
			</button>
			<div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
				<div
					class="font-serif text-lg font-normal text-ink sm:text-[21px]"
					style="font-family: 'Cinzel Decorative', serif;"
				>
					{m.catalog_title()}
				</div>
				<input
					type="text"
					placeholder={m.catalog_search()}
					class="w-full rounded-md border border-parchment-3 bg-parchment-2 px-3 py-[7px] text-xs text-ink transition-colors duration-150 outline-none placeholder:text-ink-3 focus:border-gold-2 sm:w-[155px]"
					bind:value={searchQuery}
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredPersonas as p (p.id)}
				<button
					class="catalog-card group relative cursor-pointer overflow-hidden rounded-[20px] border p-4 text-left transition-all duration-300"
					class:selected={seated.includes(p.id)}
					style="--spine: {p.spine}; --tag-bg: {p.tagBg}; --tag-color: {p.tagColor};"
					onclick={() => toggleSeat(p.id)}
				>
					<div class="flex h-full flex-col">
						<div class="flex flex-1 items-center gap-3">
							<div
								class="catalog-ribbon h-12 w-1 flex-shrink-0 rounded-full"
								style="background: {p.spine};"
							></div>

							<div class="min-w-0 flex-1">
								<div class="catalog-name-row flex min-w-0 items-center gap-2">
									<div
										class="catalog-title truncate text-[22px] leading-tight font-semibold text-ink"
									>
										{p.name}
									</div>
									<span class="catalog-glyph-selected flex-shrink-0 text-xl">{p.glyph}</span>
								</div>
							</div>
						</div>

						<div class="catalog-details mt-2 flex items-center gap-2">
							<span
								class="rounded-md px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
								style="background: var(--tag-bg); color: var(--tag-color);"
							>
								{p.tag}
							</span>
							<span class="line-clamp-1 text-[12px] leading-relaxed text-ink-3">
								{p.role}
							</span>
						</div>
					</div>
				</button>
			{/each}
		</div>

		<div class="mt-4 flex items-center justify-between">
			<span class="text-xs text-ink-3 italic">{m.catalog_seats_filled({ count: seated.length })}</span>
		</div>
	</div>

	<div class="px-4 pb-4 sm:px-[22px]">
		<button
			class="btn-shimmer relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-parchment-4 py-3 text-sm text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			onclick={closePage}
		>
			<IconArrowLeft size={18} stroke={1.5} />
			<span>{m.catalog_return()}</span>
		</button>
	</div>
</div>

<style>
	.catalog-card {
		height: 130px;
		border-color: color-mix(in srgb, var(--color-parchment-4) 80%, transparent);
		background: transparent;
		box-shadow: none;
		color: var(--color-ink-3);
		overflow: hidden;
	}

	.catalog-card:hover {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--spine) 35%, transparent);
		background: color-mix(in srgb, var(--color-parchment-2) 50%, transparent);
		box-shadow: 0 4px 12px color-mix(in srgb, var(--color-ink) 8%, transparent);
	}

	.catalog-card.selected {
		border-color: color-mix(in srgb, var(--spine) 50%, transparent);
		background: color-mix(in srgb, var(--spine) 10%, transparent);
		box-shadow: 0 4px 16px color-mix(in srgb, var(--spine) 15%, transparent);
		transform: translateY(-3px);
	}

	/* Ribbon: normal transition, but INSTANTLY disappears on select */
	.catalog-ribbon {
		transition: all 0.3s ease;
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 35%, transparent);
	}
	.catalog-card.selected .catalog-ribbon {
		transition: none;
		width: 0;
		height: 0;
		opacity: 0;
		margin-right: 0;
	}

	/* Details row fades & collapses within fixed height */
	.catalog-details {
		transition:
			opacity 0.3s ease,
			max-height 0.3s ease,
			margin-top 0.3s ease,
			padding 0.3s ease;
		max-height: 50px;
		overflow: hidden;
	}
	.catalog-card.selected .catalog-details {
		opacity: 0;
		max-height: 0;
		margin-top: 0;
		padding-top: 0;
		padding-bottom: 0;
		overflow: hidden;
		pointer-events: none;
	}

	/* Name row: smooth layout shift within fixed height */
	.catalog-name-row {
		transition: all 0.3s ease;
	}
	.catalog-card.selected .catalog-name-row {
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 4px;
		width: 100%;
	}

	.catalog-card.selected .flex-1 {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.catalog-card.selected .flex.h-full {
		justify-content: center;
	}

	.catalog-card.selected .catalog-title {
		color: var(--color-ink);
	}

	/* Glyph hidden by default, appears on select */
	.catalog-glyph-selected {
		display: none;
	}

	.catalog-card.selected .catalog-glyph-selected {
		display: inline;
	}

	/* Shine overlay */
	.catalog-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, white 18%, transparent),
			transparent 34%
		);
		pointer-events: none;
		border-radius: inherit;
	}

	.catalog-card::after {
		content: '';
		position: absolute;
		inset: 1px;
		border-radius: 19px;
		border: 1px solid color-mix(in srgb, white 20%, transparent);
		pointer-events: none;
	}
</style>
