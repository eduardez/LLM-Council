<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import {
		IconLink,
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
				aria-label={m.nav_toggle_menu()}
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
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">{m.nav_members()}</span>
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
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">{m.nav_config()}</span>
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
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">{m.nav_lang()}</span>
				</button>

				<!-- Theme -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() => openPage('theme')}
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-3 text-gold">
						<IconSun size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">{m.nav_theme()}</span>
				</button>

				<!-- History -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() => openPage('history')}
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-3 text-gold">
						<IconHistory size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">{m.nav_history()}</span>
				</button>

				<!-- Links -->
				<button
					class="nav-btn flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-parchment-3 sm:flex-row sm:gap-2 sm:px-3"
					onclick={() => openPage('links')}
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sage/10 text-sage">
						<IconLink size={16} stroke={1.5} />
					</div>
					<span class="nav-label text-[10px] font-medium text-ink sm:text-[11px]">{m.nav_links()}</span>
				</button>
			</div>
		</div>
	</div>

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
