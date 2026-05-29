<script lang="ts">
	import { IconArrowLeft, IconExternalLink } from '@tabler/icons-svelte';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		isVisible: boolean;
		closePage: () => void;
	}

	let { isVisible, closePage }: Props = $props();

	const links = [
		{
			label: m.links_forgejo_label(),
			url: 'https://git.eduard3v.com/EduarD3V/LLM-Council',
			desc: m.links_forgejo_desc()
		},
		{
			label: m.links_github_label(),
			url: 'https://github.com/eduardez/LLM-Council',
			desc: m.links_github_desc()
		}
	];
</script>

<div
	class="absolute inset-3 top-18 z-[3] flex flex-col rounded-2xl bg-parchment shadow-2xl shadow-ink/15 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
	class:invisible={!isVisible}
	style="transform: {isVisible ? 'translateY(0)' : 'translateY(100%)'};"
>
	<div class="flex-1 overflow-y-auto px-4 pt-[22px] pb-3.5 sm:px-[22px]">
		<div class="mb-4 flex flex-wrap items-center justify-between gap-2">
			<button
				class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
				onclick={closePage}
			>
				<IconArrowLeft size={16} stroke={1.5} />
				<span>{m.lang_back()}</span>
			</button>
			<div
				class="font-serif text-lg font-normal text-ink sm:text-[21px]"
				style="font-family: 'Cinzel Decorative', serif;"
			>
				{m.links_title()}
			</div>
		</div>

		<div class="flex flex-col gap-2">
			{#each links as link (link.url)}
				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex w-full items-center gap-3 rounded-lg border border-parchment-3 bg-parchment-2 px-4 py-3 text-left transition-all duration-150 hover:bg-parchment-3"
				>
					<div class="flex flex-col">
						<span class="text-sm font-medium text-ink">{link.label}</span>
						<span class="text-xs text-ink-3 italic">{link.desc}</span>
					</div>
					<span class="ml-auto text-ink-3">
						<IconExternalLink size={16} stroke={1.5} />
					</span>
				</a>
			{/each}
		</div>
	</div>

	<div class="px-4 pb-4 sm:px-[22px]">
		<button
			class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-parchment-4 py-3 text-sm text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			onclick={closePage}
		>
			<IconArrowLeft size={18} stroke={1.5} />
			<span>{m.links_return()}</span>
		</button>
	</div>
</div>
