<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import CouncilShell from '$lib/components/council/CouncilShell.svelte';

	let showSplash = $state(true);
	let phraseIdx = $state(0);
	let splashDone = $state(false);

	const phrases = [
		'Ask anything…',
		'Welcome back…',
		'One question. Many voices.',
		'The Council awaits…'
	];

	onMount(() => {
		const t1 = setTimeout(() => {
			phraseIdx = 1;
		}, 1400);

		const t2 = setTimeout(() => {
			phraseIdx = 2;
		}, 3000);

		const t3 = setTimeout(() => {
			showSplash = false;
		}, 4800);

		const t4 = setTimeout(() => {
			splashDone = true;
		}, 5600);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			clearTimeout(t4);
		};
	});
</script>

{#if showSplash}
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink"
		transition:fade={{ duration: 800 }}
	>
		<div
			class="mb-6 text-5xl font-serif tracking-widest text-gold"
			style="font-family: 'Playfair Display', serif;"
		>
			✦ The Council
		</div>
		<div class="mb-6 h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
		<div class="h-8 overflow-hidden">
			{#key phraseIdx}
				<span
					class="block animate-[splashFadeIn_400ms_ease-out_both] text-center text-lg italic text-parchment/50"
				>
					{phrases[phraseIdx]}
				</span>
			{/key}
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
