<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	let { content = '' }: { content: string } = $props();

	let html = $derived(DOMPurify.sanitize(marked.parse(content, { async: false }) as string));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html html}
