<script lang="ts">
	import { resolve } from '$app/paths';
	import { IconArrowLeft } from '@tabler/icons-svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen items-start justify-center bg-ink/10 p-0 md:p-8">
	<div
		class="flex w-full max-w-4xl flex-col overflow-hidden bg-parchment text-[15px] leading-relaxed text-ink md:min-h-0 md:rounded-2xl md:border md:border-parchment-4/60 md:shadow-2xl md:shadow-ink/15"
		style="font-family: var(--font-body);"
	>
		<div class="flex items-center gap-2 border-b border-parchment-4 px-4 py-3">
			<a
				href={resolve('/')}
				class="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ink-3 no-underline transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			>
				<IconArrowLeft size={16} stroke={1.5} />
				<span>Back to Council</span>
			</a>
		</div>

		{@render children()}
	</div>
</div>
