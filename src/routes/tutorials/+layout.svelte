<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { IconArrowLeft } from '@tabler/icons-svelte';

	let { children } = $props();

	const isTutorialPage = $derived(page.url.pathname !== '/tutorials');
</script>

<div
	class="tutorials-shell relative flex w-full max-w-6xl flex-col overflow-hidden bg-parchment text-[15px] leading-relaxed text-ink"
	style="font-family: var(--font-body);"
>
	<div class="flex shrink-0 items-center gap-2 border-b border-parchment-4 px-4 py-3">
		{#if isTutorialPage}
			<a
				href={resolve('/tutorials')}
				class="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ink-3 no-underline transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			>
				<IconArrowLeft size={16} stroke={1.5} />
				<span>Back to Tutorials</span>
			</a>
		{:else}
			<a
				href={resolve('/')}
				class="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ink-3 no-underline transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			>
				<IconArrowLeft size={16} stroke={1.5} />
				<span>Back to Council</span>
			</a>
		{/if}
	</div>

	<div class="flex-1 overflow-y-auto">
		{@render children()}
	</div>
</div>

<style>
	:global(body) {
		position: relative;
		display: flex;
		min-height: 100svh;
		justify-content: center;
		background: color-mix(in srgb, var(--color-parchment), black 14%);
		padding: 0;
		font-family: var(--font-body);
		font-size: 15px;
		line-height: 1.65;
		color: var(--color-ink);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	@media (min-width: 768px) {
		:global(body) {
			padding: 2rem;
			padding-top: 3rem;
			padding-bottom: 3rem;
		}
	}

	.tutorials-shell :global(.prose) {
		--tw-prose-body: var(--color-ink);
		--tw-prose-headings: var(--color-ink);
		--tw-prose-links: var(--color-gold);
		--tw-prose-bold: var(--color-ink);
		--tw-prose-counters: var(--color-ink-3);
		--tw-prose-bullets: var(--color-ink-3);
		--tw-prose-hr: var(--color-parchment-4);
		--tw-prose-quotes: var(--color-ink-2);
		--tw-prose-quote-borders: var(--color-parchment-4);
		--tw-prose-code: var(--color-ink);
		--tw-prose-pre-bg: var(--color-ink);
	}

	.tutorials-shell {
		height: 100dvh;
		border-radius: 0;
		border: none;
	}

	@media (min-width: 768px) {
		.tutorials-shell {
			height: calc(100dvh - 6rem);
			border-radius: 2rem;
			border: 1px solid color-mix(in srgb, var(--color-parchment-4) 60%, transparent);
			box-shadow: 0 25px 50px -8px rgba(0, 0, 0, 0.12);
		}
	}
</style>
