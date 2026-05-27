<script lang="ts">
	import { onMount } from 'svelte';
	import { IconArrowLeft, IconRefresh } from '@tabler/icons-svelte';
	import SearchableDropdown from '$lib/components/ui/SearchableDropdown.svelte';

	type Provider = 'openrouter' | 'openai' | 'anthropic' | 'google' | 'custom';

	interface Props {
		isVisible: boolean;
		closePage: () => void;
	}

	let { isVisible, closePage }: Props = $props();

	const PROVIDER_DEFAULTS: Record<Provider, { endpoint: string; model: string }> = {
		openrouter: {
			endpoint: 'https://openrouter.ai/api/v1',
			model: 'anthropic/claude-3.5-sonnet'
		},
		openai: {
			endpoint: 'https://api.openai.com/v1',
			model: 'gpt-4o'
		},
		anthropic: {
			endpoint: 'https://api.anthropic.com/v1',
			model: 'claude-3-5-sonnet-20241022'
		},
		google: {
			endpoint: 'https://generativelanguage.googleapis.com/v1beta',
			model: 'gemini-1.5-pro'
		},
		custom: {
			endpoint: 'http://localhost:11434/v1',
			model: 'llama3.1'
		}
	};

	let provider = $state<Provider>('openrouter');
	let endpoint = $state('');
	let token = $state('');
	let model = $state('');
	let saveOk = $state(false);
	let availableModels = $state<string[]>([]);
	let isFetchingModels = $state(false);
	let fetchModelsError = $state('');
	let useCustomModel = $state(false);

	function providerLabel(p: Provider): string {
		const labels: Record<Provider, string> = {
			openrouter: 'OpenRouter',
			openai: 'OpenAI',
			anthropic: 'Anthropic',
			google: 'Google',
			custom: 'Custom'
		};
		return labels[p];
	}

	const BUILTIN_MODELS: Record<Provider, string[]> = {
		openrouter: [
			'anthropic/claude-3.5-sonnet',
			'openai/gpt-4o',
			'google/gemini-1.5-pro',
			'meta-llama/llama-3.1-70b',
			'anthropic/claude-3-opus',
			'openai/gpt-4o-mini'
		],
		openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
		anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
		google: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
		custom: ['llama3.1', 'llama3', 'mistral', 'codellama', 'phi3']
	};

	async function fetchModels() {
		isFetchingModels = true;
		fetchModelsError = '';
		availableModels = [];

		try {
			let models: string[] = [];

			if (provider === 'openrouter') {
				const res = await fetch('https://openrouter.ai/api/v1/models');
				if (res.ok) {
					const data = await res.json();
					models = data.data?.map((m: { id: string }) => m.id) || [];
				}
			} else if (provider === 'openai' && token) {
				const res = await fetch(`${endpoint}/models`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				if (res.ok) {
					const data = await res.json();
					models = data.data?.map((m: { id: string }) => m.id) || [];
				}
			} else if (provider === 'custom') {
				// Try Ollama's tags endpoint
				const ollamaEndpoint = endpoint.replace('/v1', '');
				const res = await fetch(`${ollamaEndpoint}/api/tags`);
				if (res.ok) {
					const data = await res.json();
					models = data.models?.map((m: { name: string }) => m.name) || [];
				}
			}

			if (models.length > 0) {
				availableModels = models;
			} else {
				// Fallback to built-in list
				availableModels = BUILTIN_MODELS[provider];
				fetchModelsError = 'Could not fetch models — using built-in list';
			}
		} catch {
			availableModels = BUILTIN_MODELS[provider];
			fetchModelsError = 'Could not fetch models — using built-in list';
		} finally {
			isFetchingModels = false;
		}
	}

	function applyProviderDefaults(p: Provider) {
		const defaults = PROVIDER_DEFAULTS[p];
		endpoint = defaults.endpoint;
		model = defaults.model;
		useCustomModel = false;
		fetchModels();
	}

	function handleProviderChange(v: string) {
		provider = v as Provider;
		applyProviderDefaults(provider);
	}

	function toggleCustomModel() {
		useCustomModel = !useCustomModel;
		if (!useCustomModel) {
			model = availableModels[0] || PROVIDER_DEFAULTS[provider].model;
		}
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem('council_cfg_v2');
			if (saved) {
				const data = JSON.parse(saved);
				provider = data.provider || 'openrouter';
				endpoint = data.endpoint || '';
				token = data.token || '';
				model = data.model || '';
				fetchModels();
			} else {
				applyProviderDefaults('openrouter');
			}
		} catch (e) {
			console.error('Failed to load config:', e);
			applyProviderDefaults('openrouter');
		}
	});

	function saveConfig() {
		localStorage.setItem(
			'council_cfg_v2',
			JSON.stringify({
				provider,
				endpoint,
				token,
				model
			})
		);
		saveOk = true;
		setTimeout(() => {
			saveOk = false;
		}, 2500);
	}
</script>

<div
	class="absolute inset-3 top-18 z-[3] flex flex-col rounded-2xl bg-parchment shadow-2xl shadow-ink/15 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
	class:invisible={!isVisible}
	style="transform: {isVisible ? 'translateY(0)' : 'translateY(100%)'};"
>
	<div class="flex-1 overflow-y-auto px-4 pt-[22px] pb-3.5 sm:px-[22px]">
		<div class="mb-2 flex items-center justify-between">
			<button
				class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
				onclick={closePage}
			>
				<IconArrowLeft size={16} stroke={1.5} />
				<span>Council</span>
			</button>
			<div
				class="font-serif text-[21px] font-normal text-ink"
				style="font-family: 'Playfair Display', serif;"
			>
				Configuration
			</div>
		</div>
		<p class="mb-4 text-xs text-ink-3 italic">
			Everything stays in your browser. Nothing reaches the server.
		</p>

		<div
			class="mb-[18px] flex gap-2.5 rounded-lg border border-parchment-3 bg-parchment-2 p-[11px]"
		>
			<span class="mt-[1px] flex-shrink-0 text-[17px] text-gold">🔒</span>
			<div class="text-xs leading-relaxed text-ink-3">
				Your API key and all conversations are stored only in your browser's localStorage. Each
				request goes directly to the configured endpoint — no Council server ever sees your token or
				data.
			</div>
		</div>

		<div class="mb-3.5">
			<label for="cfg-provider" class="mb-1 block text-xs font-medium text-ink-2">Provider</label>
			<SearchableDropdown
				id="cfg-provider"
				options={[
					{ value: 'openrouter', label: 'OpenRouter' },
					{ value: 'openai', label: 'OpenAI' },
					{ value: 'anthropic', label: 'Anthropic' },
					{ value: 'google', label: 'Google' },
					{ value: 'custom', label: 'Custom' }
				]}
				value={provider}
				onchange={(v) => handleProviderChange(v)}
				placeholder="Select provider"
			/>
		</div>

		<div class="mb-3.5">
			<label for="cfg-ep" class="mb-1 block text-xs font-medium text-ink-2">API endpoint</label>
			<input
				id="cfg-ep"
				type="text"
				placeholder="https://..."
				class="w-full rounded-md border border-parchment-3 bg-parchment-2 px-[11px] py-2 text-[13px] text-ink transition-colors duration-150 outline-none focus:border-gold-2"
				bind:value={endpoint}
			/>
			<div class="mt-[3px] text-[11px] text-ink-3 italic">
				Override to use a proxy, local model, or alternative provider.
			</div>
		</div>

		<div class="mb-3.5">
			<label for="cfg-tk" class="mb-1 block text-xs font-medium text-ink-2">API token</label>
			<input
				id="cfg-tk"
				type="password"
				placeholder="sk-..."
				class="w-full rounded-md border border-parchment-3 bg-parchment-2 px-[11px] py-2 text-[13px] text-ink transition-colors duration-150 outline-none focus:border-gold-2"
				bind:value={token}
			/>
			<div class="mt-[3px] text-[11px] text-ink-3 italic">
				Stored in localStorage, never sent to Council servers.
			</div>
		</div>
		<div class="mb-3.5">
			<div class="mb-1 flex items-center justify-between">
				<label for="cfg-model" class="text-xs font-medium text-ink-2">Model</label>
				<button
					class="flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-ink-3 transition-colors hover:bg-parchment-3 hover:text-ink"
					onclick={fetchModels}
					disabled={isFetchingModels}
					title="Refresh model list"
				>
					<IconRefresh size={12} stroke={1.5} class={isFetchingModels ? 'animate-spin' : ''} />
					{isFetchingModels ? 'Fetching…' : 'Refresh'}
				</button>
			</div>
			{#if useCustomModel}
				<input
					id="cfg-model"
					type="text"
					placeholder="Enter model name..."
					class="w-full rounded-md border border-parchment-3 bg-parchment-2 px-[11px] py-2 text-[13px] text-ink transition-colors duration-150 outline-none focus:border-gold-2"
					bind:value={model}
				/>
			{:else}
				<SearchableDropdown
					id="cfg-model"
					options={availableModels.map((m) => ({ value: m, label: m }))}
					value={model}
					onchange={(v) => (model = v)}
					placeholder="Select model"
				/>
			{/if}
			{#if fetchModelsError}
				<div class="mt-[3px] text-[11px] text-burgundy italic">{fetchModelsError}</div>
			{/if}
			<button
				class="mt-1 cursor-pointer text-[11px] text-ink-3 italic underline transition-colors hover:text-ink"
				onclick={toggleCustomModel}
			>
				{useCustomModel ? '← Back to list' : 'Or enter custom model…'}
			</button>
		</div>


		<div class="flex items-center">
			<button
				class="cursor-pointer rounded-md border border-gold bg-gold px-5 py-2 font-serif text-[13px] text-parchment transition-all duration-150 hover:border-ink-2 hover:bg-ink-2"
				style="font-family: 'Playfair Display', serif;"
				onclick={saveConfig}
			>
				Save to browser
			</button>
			{#if saveOk}
				<span class="ml-2.5 text-xs text-sage italic">✓ Saved</span>
			{/if}
		</div>
	</div>

	<div class="px-4 pb-4 sm:px-[22px]">
		<button
			class="btn-shimmer relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-parchment-4 py-3 text-sm text-ink-3 transition-all duration-150 hover:bg-parchment-3 hover:text-ink"
			onclick={closePage}
		>
			<IconArrowLeft size={18} stroke={1.5} />
			<span>Back to the sanctum</span>
		</button>
	</div>
</div>
