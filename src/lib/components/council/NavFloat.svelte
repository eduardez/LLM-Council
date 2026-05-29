<script lang="ts">
	import {
		IconKey,
		IconLanguage,
		IconMasksTheater,
		IconSettings,
		IconSun,
		IconHistory
	} from '@tabler/icons-svelte';

	interface Props {
		currentPage: string | null;
		menuOpen: boolean;
		handleMainBtn: () => void;
		openPage: (page: string) => void;
	}

	let { currentPage, menuOpen, handleMainBtn, openPage }: Props = $props();
	let peekHover = $state(false);

	let toast = $state<string | null>(null);

	function showToast(msg: string) {
		toast = msg;
		setTimeout(() => (toast = null), 2200);
	}
</script>

<div class="absolute inset-x-0 bottom-0 z-10" class:pointer-events-none={currentPage}>
	<!-- Panel clipped at its own height — bottom corners match the shell -->
	<div class="overflow-hidden md:rounded-b-[2rem]">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="w-full transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
			style="transform: translateY({currentPage
				? '100%'
				: menuOpen
					? '0'
					: peekHover
						? '0'
						: 'calc(100% - 1.75rem)'});"
			onmouseenter={() => {
				if (!menuOpen && !currentPage) peekHover = true;
			}}
			onmouseleave={() => (peekHover = false)}
		>
			<!-- Handle bar — only visible when panel is closed -->
			<button
				class="flex w-full cursor-pointer justify-center py-3"
				onclick={handleMainBtn}
				aria-label="Toggle menu"
			>
				<div
					class="h-1 w-12 rounded-full bg-gold/30 transition-all duration-300 hover:w-14 hover:bg-gold/60"
				></div>
			</button>

			<div
				class="flex w-full items-center justify-center gap-1 border-t border-parchment-4 bg-parchment-2/50 px-1 py-2 sm:gap-4 sm:px-3"
			>
				<!-- Members -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() => openPage('catalog')}
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-3 text-gold">
						<IconMasksTheater size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">Members</span>
				</button>

				<!-- Config -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() => openPage('config')}
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-burgundy/10 text-burgundy"
					>
						<IconSettings size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">Config</span>
				</button>

				<!-- Language -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() => openPage('lang')}
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-parchment-3 text-ink-2"
					>
						<IconLanguage size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">Lang</span>
				</button>

				<!-- Theme -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() => openPage('theme')}
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-3 text-gold">
						<IconSun size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">Theme</span>
				</button>

				<!-- History -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() => openPage('history')}
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-3 text-gold">
						<IconHistory size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">History</span>
				</button>

				<!-- Sign in -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() =>
						showToast('Sign-in is not available in this static build. Config is stored locally.')}
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sage/10 text-sage">
						<IconKey size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">Sign in</span>
				</button>
			</div>
		</div>
	</div>

	{#if toast}
		<div
			class="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gold-2 bg-parchment px-5 py-2.5 shadow-xl transition-all duration-300"
		>
			<span class="text-sm text-ink-2">{toast}</span>
		</div>
	{/if}
</div>

<style>
	@media (max-width: 419px) {
		.nav-btn {
			padding-left: 0.375rem !important;
			padding-right: 0.375rem !important;
		}
	}

	@media (max-width: 379px) {
		.nav-label {
			display: none;
		}
	}
</style>
