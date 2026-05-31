<script lang="ts">
	import { resolve } from '$app/paths';
	import { TUTORIALS } from '$lib/content/tutorials';
</script>

<svelte:head>
	<title>Tutorials — LLM Council</title>
	<meta
		name="description"
		content="Learn how to use LLM Council with step-by-step tutorials. Get started with AI persona deliberation, configure providers, choose personas, and more."
	/>
	<meta property="og:title" content="Tutorials — LLM Council" />
	<meta
		property="og:description"
		content="Step-by-step guides for using LLM Council, the AI persona deliberation platform."
	/>
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://council.eduard3v.com/tutorials" />
</svelte:head>

<div class="px-4 py-8 md:px-8 md:py-12">
	<h1 class="mb-2 font-serif text-3xl text-ink">Tutorials</h1>
	<p class="mb-10 text-sm text-ink-3">Step-by-step guides to get the most out of LLM Council.</p>

	{#if TUTORIALS.length === 0}
		<div class="rounded-xl border border-parchment-4 bg-parchment-2 px-6 py-10 text-center">
			<p class="text-sm text-ink-3">No tutorials yet. Coming soon.</p>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each TUTORIALS as tutorial (tutorial.slug)}
				<article
					class="group rounded-xl border border-parchment-4 bg-parchment p-5 transition-all duration-200 hover:border-gold-2 hover:shadow-md"
				>
					<a href={resolve('/tutorials') + '/' + tutorial.slug} class="block">
						<h2 class="mb-2 font-serif text-lg text-ink transition-colors group-hover:text-gold">
							{tutorial.title}
						</h2>
						<p class="mb-3 text-xs leading-relaxed text-ink-3">
							{tutorial.description}
						</p>
						<div class="flex flex-wrap gap-1.5">
							{#each tutorial.tags as tag (tag)}
								<span
									class="rounded-full bg-parchment-3 px-2.5 py-0.5 text-[10px] tracking-wide text-ink-3 uppercase"
								>
									{tag}
								</span>
							{/each}
						</div>
						<div class="mt-3 text-[11px] text-ink-3">{tutorial.date}</div>
					</a>
				</article>
			{/each}
		</div>
	{/if}
</div>
