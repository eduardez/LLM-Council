<script lang="ts">
	import { IconArrowLeft, IconCheck } from '@tabler/icons-svelte';
	import { locales, setLocale, getLocale } from '$lib/paraglide/runtime';

	interface Props {
		isVisible: boolean;
		closePage: () => void;
	}

	let { isVisible, closePage }: Props = $props();

	const langNames: Record<string, string> = {
		en: 'English',
		es: 'Español'
	};

	const langFlags: Record<string, string> = {
		en: '🇬🇧',
		es: '🇪🇸'
	};

	let currentLang = $state(getLocale());
</script>

<div
	class="absolute inset-3 top-18 z-[3] flex flex-col rounded-2xl bg-parchment shadow-2xl shadow-ink/15 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
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
			<div
				class="font-serif text-[21px] font-normal text-ink"
				style="font-family: 'Cinzel Decorative', serif;"
			>
				Language
			</div>
		</div>

		<div class="flex flex-col gap-2">
			{#each locales as locale (locale)}
				<button
					class="flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-150 hover:bg-parchment-3"
					class:border-gold-2={locale === currentLang}
					class:border-parchment-3={locale !== currentLang}
					class:bg-parchment-2={locale !== currentLang}
					onclick={() => {
						currentLang = locale;
						setLocale(locale);
					}}
				>
					<span class="text-xl">{langFlags[locale]}</span>
					<div class="flex flex-col">
						<span class="text-sm font-medium text-ink">{langNames[locale]}</span>
						<span class="text-xs text-ink-3 italic">{locale}</span>
					</div>
					{#if locale === currentLang}
						<span class="ml-auto text-gold">
							<IconCheck size={18} stroke={1.5} />
						</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="px-4 pb-4 sm:px-[22px]">
		<button
			class="btn-shimmer relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-parchment-4 py-3 text-sm text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			onclick={closePage}
		>
			<IconArrowLeft size={18} stroke={1.5} />
			<span>Return to council</span>
		</button>
	</div>
</div>
