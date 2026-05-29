<script lang="ts">
	import { onMount } from 'svelte';
	import { initMixpanel } from '$lib/analytics';

	const STORAGE_KEY = 'council_consent';

	let visible = $state(false);

	onMount(() => {
		if (typeof localStorage === 'undefined') return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'accepted') {
			initMixpanel();
		} else if (!stored) {
			visible = true;
		}
	});

	function accept() {
		localStorage.setItem(STORAGE_KEY, 'accepted');
		initMixpanel();
		visible = false;
	}

	function decline() {
		localStorage.setItem(STORAGE_KEY, 'declined');
		visible = false;
	}
</script>

{#if visible}
	<div
		class="fixed bottom-0 left-0 right-0 z-50 border-t border-parchment-4 bg-parchment px-4 py-3.5 shadow-2xl shadow-ink/10 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-sm sm:rounded-xl sm:border"
	>
		<p class="mb-3 text-xs leading-relaxed text-ink-3">
			This site uses Mixpanel to understand how the Council is used. No personal data is collected.
		</p>
		<div class="flex items-center gap-2">
			<button
				class="cursor-pointer rounded-md border border-gold bg-gold px-4 py-1.5 text-xs text-parchment transition-colors hover:border-ink-2 hover:bg-ink-2"
				onclick={accept}
			>
				Accept
			</button>
			<button
				class="cursor-pointer rounded-md border border-parchment-4 bg-transparent px-4 py-1.5 text-xs text-ink-3 transition-colors hover:bg-parchment-3 hover:text-ink"
				onclick={decline}
			>
				Decline
			</button>
		</div>
	</div>
{/if}
