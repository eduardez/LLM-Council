<script lang="ts">
	let {
		options = [],
		value = $bindable(''),
		placeholder = 'Select...',
		onchange = (_v: string) => {}
	}: {
		options: Array<{ value: string; label: string }>;
		value?: string;
		placeholder?: string;
		onchange?: (value: string) => void;
	} = $props();

	let isOpen = $state(false);
	let filterText = $state('');
	let highlightedIndex = $state(0);
	let containerRef: HTMLDivElement | undefined = $state();
	let inputRef: HTMLInputElement | undefined = $state();

	const listboxId = 'dropdown-listbox-' + Math.random().toString(36).slice(2, 9);

	let filteredOptions = $derived(
		filterText
			? options.filter((o) =>
					o.label.toLowerCase().includes(filterText.toLowerCase())
				)
			: options
	);

	let selectedLabel = $derived(
		options.find((o) => o.value === value)?.label || ''
	);

	function toggleOpen() {
		isOpen = !isOpen;
		if (isOpen) {
			filterText = '';
			highlightedIndex = 0;
		}
	}

	function selectOption(optionValue: string) {
		value = optionValue;
		isOpen = false;
		onchange(optionValue);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
		}

		if (!isOpen) {
			if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
				isOpen = true;
				filterText = '';
				highlightedIndex = 0;
				e.preventDefault();
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				highlightedIndex = Math.min(
					highlightedIndex + 1,
					filteredOptions.length - 1
				);
				e.preventDefault();
				break;
			case 'ArrowUp':
				highlightedIndex = Math.max(highlightedIndex - 1, 0);
				e.preventDefault();
				break;
			case 'Enter':
				if (filteredOptions[highlightedIndex]) {
					selectOption(filteredOptions[highlightedIndex].value);
				}
				e.preventDefault();
				break;
			case 'Escape':
				isOpen = false;
				e.preventDefault();
				break;
		}
	}

	// Focus the filter input when dropdown opens
	$effect(() => {
		if (isOpen && inputRef) {
			inputRef.focus();
		}
	});

	// Handle clicks outside to close
	$effect(() => {
		if (!isOpen) return;

		const handleClick = (e: MouseEvent) => {
			if (containerRef && !containerRef.contains(e.target as Node)) {
				isOpen = false;
			}
		};

		const timeoutId = setTimeout(() => {
			document.addEventListener('click', handleClick);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener('click', handleClick);
		};
	});
</script>

<div
	bind:this={containerRef}
	class="relative"
	onkeydown={handleKeydown}
	role="combobox"
	aria-expanded={isOpen}
	aria-haspopup="listbox"
	aria-controls={listboxId}
	tabindex="0"
>
	<button
		type="button"
		class="flex w-full cursor-pointer items-center justify-between rounded-md border bg-parchment-2 px-[11px] py-2 text-[13px] text-ink transition-colors duration-150 outline-none"
		class:border-parchment-3={!isOpen}
		class:border-gold-2={isOpen}
		onclick={toggleOpen}
		tabindex="-1"
	>
		<span class={selectedLabel ? 'text-ink' : 'text-ink-3'}>
			{selectedLabel || placeholder}
		</span>
		<svg
			class="h-3 w-3 flex-shrink-0 text-ink-3 transition-transform duration-150 {isOpen ? 'rotate-180' : ''}"
			viewBox="0 0 10 6"
			fill="none"
		>
			<path
				d="M1 1L5 5L9 1"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	{#if isOpen}
		<div
			id={listboxId}
			class="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-parchment-3 bg-parchment shadow-lg"
			role="listbox"
		>
			<input
				bind:this={inputRef}
				type="text"
				class="w-full border-b border-parchment-3 bg-transparent px-3 py-2 text-xs outline-none"
				placeholder="Search..."
				bind:value={filterText}
				role="searchbox"
			/>
			<div class="max-h-[200px] overflow-y-auto">
				{#if filteredOptions.length === 0}
					<div class="px-3 py-1.5 text-xs italic text-ink-3">
						No options found
					</div>
				{:else}
					{#each filteredOptions as option, i (option.value)}
						<div
							class="cursor-pointer px-3 py-1.5 text-xs transition-colors duration-75"
							class:bg-parchment-3={highlightedIndex === i}
							class:hover-bg-parchment-3={highlightedIndex !== i}
							onmousedown={() => selectOption(option.value)}
							role="option"
							aria-selected={option.value === value}
							tabindex="-1"
						>
							{option.label}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
