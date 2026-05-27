<script lang="ts">
	import { onMount } from 'svelte';
	import CouncilShell from '$lib/components/council/CouncilShell.svelte';

	let showSplash = $state(true);
	let splashVisible = $state(false);
	let phraseIdx = $state(0);
	let phraseVisible = $state(true);

	const phrases = [
		'Ask anything…',
		'Welcome back…',
		'One question. Many voices.',
		'The Council awaits…'
	];

	onMount(() => {
		requestAnimationFrame(() => {
			splashVisible = true;
		});

		const t1 = setTimeout(() => {
			phraseVisible = false;
			setTimeout(() => {
				phraseIdx = 1;
				phraseVisible = true;
			}, 350);
		}, 1200);

		const t2 = setTimeout(() => {
			phraseVisible = false;
			setTimeout(() => {
				phraseIdx = 2;
				phraseVisible = true;
			}, 350);
		}, 2800);

		const t3 = setTimeout(() => {
			splashVisible = false;
			setTimeout(() => {
				showSplash = false;
			}, 800);
		}, 4200);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	});
</script>

{#if showSplash}
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink transition-opacity duration-[800ms] ease-in-out"
		class:opacity-100={splashVisible}
		class:opacity-0={!splashVisible}
	>
		<div
			class="mb-6 text-5xl font-serif tracking-widest text-gold"
			style="font-family: 'Playfair Display', serif;"
		>
			✦ The Council
		</div>
		<div class="mb-6 h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
		<div class="h-8 overflow-hidden">
			<span
				class="block text-center text-lg italic text-parchment/50 transition-all duration-[350ms] ease-in-out"
				class:opacity-100={phraseVisible}
				class:opacity-0={!phraseVisible}
				class:translate-y-0={phraseVisible}
				class:translate-y-1={!phraseVisible}
			>
				{phrases[phraseIdx]}
			</span>
		</div>
	</div>
{/if}

<CouncilShell />
