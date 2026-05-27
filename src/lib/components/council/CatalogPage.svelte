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
	class="absolute inset-3 z-[3] flex flex-col rounded-2xl bg-parchment shadow-2xl shadow-ink/15 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
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
					style="font-family: 'Playfair Display', serif;"
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

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each filteredPersonas as p (p.id)}
				<button
					class="persona-card group relative cursor-pointer overflow-hidden rounded-[20px] border p-4 text-left transition-all duration-300"
					class:selected={seated.includes(p.id)}
					onclick={() => toggleSeat(p.id)}
				>
					<div class="flex h-full flex-col">
						<div class="flex flex-1 items-center align-middle m-auto gap-2.5">
							<div
								class="persona-ribbon flex-shrink-0 rounded-full"
								style="background: {p.spine};"
							></div>

							<div class="min-w-0">
								<div class="flex items-center gap-2 name-row">
									<div
										class="persona-title truncate text-[22px] leading-tight font-semibold text-ink"
										style="font-family: 'Playfair Display', serif;"
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
		border-color: rgba(112, 88, 64, 0.18);
		background: transparent;
		box-shadow: none;
		color: #ddd0c0;
	}

	.persona-card:hover {
		transform: translateY(-3px);
		border-color: rgba(180, 145, 90, 0.25);
		background: rgba(255, 255, 255, 0.04);
		box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.06);
	}

	.persona-card.selected {
		border-color: rgba(180, 145, 90, 0.55);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 100%),
			linear-gradient(180deg, #f7f1e8 0%, #f2eadf 100%);
		box-shadow:
			0px 4px 4px 4px rgba(180, 145, 90, 0.15);
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
		color: #2d2218;
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
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), transparent 34%);
		pointer-events: none;
		border-radius: inherit;
	}

	.persona-card::after {
		content: '';
		position: absolute;
		inset: 1px;
		border-radius: 19px;
		border: 1px solid rgba(255, 255, 255, 0.32);
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
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
	}





	.persona-title {
		letter-spacing: -0.02em;
	}

</style>
