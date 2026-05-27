<script lang="ts">
	import { IconArrowLeft, IconCheck } from '@tabler/icons-svelte';

	interface Props {
		isVisible: boolean;
		closePage: () => void;
	}

	let { isVisible, closePage }: Props = $props();

	const themes = [
		{
			id: 'parchment',
			name: 'Parchment',
			desc: 'Black & white · red accent',
			colors: ['#fcf8f6', '#f5f0ec', '#e8e0d8', '#c0392b']
		},
		{
			id: 'slate',
			name: 'Slate',
			desc: 'Cool neutral grays',
			colors: ['#e8edf0', '#dce3e8', '#c8d2d8', '#5c84a0']
		},
		{
			id: 'moss',
			name: 'Moss',
			desc: 'Earthy green undertones',
			colors: ['#edf0e8', '#dce3d8', '#c8d2c0', '#5c845c']
		},
		{
			id: 'mocha',
			name: 'Mocha Mousse',
			desc: 'Warm rich cocoa tones',
			colors: ['#f4ede4', '#ebe0d3', '#ddd0c0', '#a0724a']
		},
		{
			id: 'midnight',
			name: 'Midnight',
			desc: 'Dark with gold accents',
			colors: ['#1a1a24', '#22222e', '#2e2e3e', '#c4a97a']
		},
		{
			id: 'mono-blue',
			name: 'Mono Blue',
			desc: 'Black & white · blue accent',
			colors: ['#f8fafc', '#eef2f5', '#dce2e8', '#2980b9']
		},
		{
			id: 'mono-green',
			name: 'Mono Green',
			desc: 'Black & white · green accent',
			colors: ['#f8fcf8', '#eef5f0', '#dce8de', '#27ae60']
		},
		{
			id: 'dark-blue',
			name: 'Dark Blue',
			desc: 'Deep navy · blue glow',
			colors: ['#0e1014', '#16181e', '#20242c', '#4aacdc']
		},
		{
			id: 'dark-green',
			name: 'Dark Green',
			desc: 'Deep forest · green glow',
			colors: ['#0e120e', '#161c16', '#222a22', '#3cc87a']
		}
	];

	let activeTheme = $state(
		(typeof localStorage !== 'undefined' ? localStorage.getItem('council_theme') : null) ||
			'parchment'
	);

	function setTheme(id: string) {
		activeTheme = id;
		localStorage.setItem('council_theme', id);
		document.documentElement.className = id === 'parchment' ? '' : `theme-${id}`;
	}
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
				<span>Council</span>
			</button>
			<div
				class="font-serif text-lg font-normal text-ink sm:text-[21px]"
				style="font-family: 'Cinzel Decorative', serif;"
			>
				Theme
			</div>
		</div>

		<div class="flex flex-col gap-2">
			{#each themes as t (t.id)}
				<button
					class="flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-150 hover:bg-parchment-3"
					class:border-gold-2={t.id === activeTheme}
					class:border-parchment-3={t.id !== activeTheme}
					onclick={() => setTheme(t.id)}
				>
					<div class="flex gap-[3px]">
						{#each t.colors as c (c)}
							<div class="h-7 w-[18px] rounded-sm" style="background: {c}"></div>
						{/each}
					</div>
					<div class="flex flex-col">
						<span class="text-sm font-medium text-ink">{t.name}</span>
						<span class="text-xs text-ink-3 italic">{t.desc}</span>
					</div>
					{#if t.id === activeTheme}
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
			<span>Back to the Council</span>
		</button>
	</div>
</div>
