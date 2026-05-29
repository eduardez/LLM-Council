<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages';
	import CouncilShell from '$lib/components/council/CouncilShell.svelte';

	let showSplash = $state(true);
	let phraseIdx = $state(0);
	let splashDone = $state(false);

	const phrases = $derived([m.splash_ask(), m.splash_welcome(), m.splash_loading()]);

	onMount(() => {
		const t1 = setTimeout(() => {
			phraseIdx = 1;
		}, 1400);

		const t2 = setTimeout(() => {
			showSplash = false;
		}, 3000);

		const t3 = setTimeout(() => {
			splashDone = true;
		}, 4800);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	});
</script>

{#if showSplash}
	<div
		class="fixed inset-0 z-50 grid place-items-center bg-parchment px-4"
		transition:fade={{ duration: 800 }}
	>
		<div class="flex flex-col items-center">
			<div
				class="mb-4 text-center font-serif text-3xl tracking-widest text-gold sm:mb-6 sm:text-5xl"
				style="font-family: 'Cinzel Decorative', serif;"
			>
				{m.splash_the_council()}
			</div>
			<div
				class="mb-4 h-px w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent sm:mb-6 sm:w-20"
			></div>
			<div class="h-8 overflow-hidden">
				{#key phraseIdx}
					<span class="block animate-pulse text-center text-base text-ink/40 italic sm:text-lg">
						{phrases[phraseIdx]}
					</span>
				{/key}
			</div>
		</div>
	</div>
{/if}

<CouncilShell {splashDone} />

<style>
	@keyframes splashFadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
