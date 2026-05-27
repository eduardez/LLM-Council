<script lang="ts">
	import { onMount } from 'svelte';
	import HomePage from './HomePage.svelte';
	import SessionPage from './SessionPage.svelte';
	import CatalogPage from './CatalogPage.svelte';
	import ConfigPage from './ConfigPage.svelte';
	import LangPage from './LangPage.svelte';
	import ThemePage from './ThemePage.svelte';
	import NavFloat from './NavFloat.svelte';

	interface Persona {
		id: number;
		glyph: string;
		name: string;
		role: string;
		tag: string;
		tagBg: string;
		tagColor: string;
		spine: string;
		quote: string;
		conflicts: string;
		prompt: string;
	}

	let personas = $state<Persona[]>([]);
	let seated = $state<number[]>([0, 1, 2]);
	let currentPage = $state<string | null>(null);
	let menuOpen = $state(false);
	let question = $state('');
	let sessionData = $state<{
		question: string;
		speeches: Array<{ name: string; speech: string; personaId: number }>;
		reviews: Array<{
			name: string;
			review: string;
			scores: Array<{ name: string; score: number }>;
		}>;
		synthesis: string;
	} | null>(null);

	onMount(async () => {
		try {
			const res = await fetch('/api/personas');
			if (res.ok) {
				personas = await res.json();
			}
		} catch (error) {
			console.error('Failed to load personas:', error);
		}

		const savedTheme = localStorage.getItem('council_theme');
		if (savedTheme && savedTheme !== 'parchment') {
			document.documentElement.className = `theme-${savedTheme}`;
		}
	});

	function openPage(page: string) {
		if (menuOpen) {
			menuOpen = false;
			setTimeout(() => {
				currentPage = page;
			}, 220);
		} else {
			currentPage = page;
		}
	}

	function closePage() {
		currentPage = null;
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function handleMainBtn() {
		if (currentPage) {
			closePage();
		} else {
			toggleMenu();
		}
	}

	function toggleSeat(id: number) {
		if (seated.includes(id)) {
			seated = seated.filter((s) => s !== id);
		} else if (seated.length < 12) {
			seated = [...seated, id];
		}
	}

	function reorderSeats(from: number, to: number) {
		const newSeated = [...seated];
		const [moved] = newSeated.splice(from, 1);
		newSeated.splice(to, 0, moved);
		seated = newSeated;
	}

	function startSession(q: string) {
		question = q;
		currentPage = 'session';
		sessionData = null;
	}

	function setSessionData(data: typeof sessionData) {
		sessionData = data;
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="council-shell relative flex w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-parchment-4/60 bg-parchment text-ink shadow-2xl shadow-ink/10 sm:rounded-2xl md:rounded-[2rem]"
	style="font-family: 'Lora', serif;"
>
	<HomePage {personas} {seated} {reorderSeats} {openPage} {startSession} isVisible={!currentPage} />

	<!-- Backdrop when subpage is open -->
	<div
		class="absolute inset-0 z-[2] bg-ink/15 transition-opacity duration-[400ms]"
		style="opacity: {currentPage ? 1 : 0}"
		class:pointer-events-auto={!!currentPage}
		class:pointer-events-none={!currentPage}
		role="button"
		aria-label="Close subpage"
		tabindex="-1"
		onclick={closePage}
		onkeydown={(e) => e.key === 'Enter' && closePage()}
	></div>

	<SessionPage
		{question}
		{personas}
		{seated}
		{sessionData}
		{setSessionData}
		isVisible={currentPage === 'session'}
		{closePage}
	/>

	<CatalogPage {personas} {seated} {toggleSeat} isVisible={currentPage === 'catalog'} {closePage} />

	<ConfigPage isVisible={currentPage === 'config'} {closePage} />

	<LangPage isVisible={currentPage === 'lang'} {closePage} />

	<ThemePage isVisible={currentPage === 'theme'} {closePage} />

	<NavFloat {currentPage} {menuOpen} {handleMainBtn} {openPage} />
</div>

<style>
	:global(body) {
		position: relative;
		display: flex;
		min-height: 100svh;
		justify-content: center;
		background: var(--color-parchment-3);
		padding: 1.5rem 1rem;
		font-family: var(--font-body);
		color: var(--color-ink);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	@media (min-width: 640px) {
		:global(body) {
			padding: 1.5rem;
		}
	}

	@media (min-width: 768px) {
		:global(body) {
			padding: 2rem;
			padding-top: 3rem;
			padding-bottom: 3rem;
		}
	}

	.council-shell {
		height: calc(100dvh - 3rem);
	}

	@media (min-width: 768px) {
		.council-shell {
			height: calc(100dvh - 6rem);
		}
	}
</style>
