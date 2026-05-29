# LLM Council

A SvelteKit 5 static SPA that orchestrates AI persona-driven deliberations. Assemble a council of AI archetypes, pose a question, and watch them debate, review, and synthesize a response.

**Live at [council.eduard3v.com](https://council.eduard3v.com)**

## Quick start

```sh
bun install
bun run dev
```

Open `http://localhost:5173`, configure an AI provider + API key under Config, pick your council members, and ask away.

## Features

- **12 personas** — archetypes with distinct cognitive lenses, voices, and inter-persona conflicts (The Pragmatist, The Builder, The Visionary, The Contrarian, The Skeptic, The Scholar, The Poet, The Alchemist, The Judge, The Caretaker, The Trickster, The Anarchist)
- **Multi-provider** — OpenAI, Anthropic, Google, OpenRouter, or any OpenAI-compatible endpoint
- **Streaming responses** — real-time speech, review, and synthesis via Vercel AI SDK
- **History** — past sessions saved to localStorage
- **Themes** — 18 color themes (parchment, slate, midnight, moss, 6 light mono, 6 dark mono)
- **i18n** — English and Spanish (Paraglide / inlang)
- **Fully client-side** — API keys stay in localStorage, no server needed

## Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun run dev` | Start Vite dev server |
| `bun run build` | Build static site to `build/` |
| `bun run preview` | Preview production build |
| `bun run check` | Typecheck (svelte-check) |
| `bun run lint` | Prettier + ESLint |
| `bun run format` | Prettier --write |

Run `bun run prepare` or `bun run dev` once after cloning to generate `.svelte-kit/` types.

## Stack

- **Framework**: Svelte 5 (runes), SvelteKit 2, `@sveltejs/adapter-static`
- **Language**: TypeScript (strict)
- **CSS**: Tailwind CSS v4 (`@import`, `@theme`), plugins `@tailwindcss/forms` + `@tailwindcss/typography`
- **AI**: Vercel AI SDK v6 (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/openai-compatible`)
- **i18n**: Paraglide / inlang (`en`, `es`)
- **Icons**: `@tabler/icons-svelte`
- **Markdown**: `marked` + `dompurify` (client-side), `mdsvex` (`.svx`/`.md` routes)
- **Toasts**: `@zerodevx/svelte-toast`

## Architecture

The app is a single-page application with client-side routing via a custom page state machine in `CouncilShell.svelte`:

| Page | Component | Route key |
|------|-----------|-----------|
| Home | `HomePage.svelte` | (default) |
| Session | `SessionPage.svelte` | `session` |
| Member catalog | `CatalogPage.svelte` | `catalog` |
| Provider config | `ConfigPage.svelte` | `config` |
| Theme picker | `ThemePage.svelte` | `theme` |
| Language | `LangPage.svelte` | `lang` |
| History | `HistoryPage.svelte` | `history` |
| Links | `LinksPage.svelte` | `links` |

AI provider abstraction lives in `src/lib/ai/council.ts` — supports 5 provider types via the AI SDK. Personas are defined in `src/lib/data/personas.ts` (see `GUIDE.md` in the same directory for prompt methodology).

## Deployment

Deployed to Cloudflare Pages via Forgejo CI. The `.forgejo/workflows/deploy.yml` workflow:

- Installs dependencies (`bun install --no-cache`)
- Builds (`bun run build`)
- Deploys (`bunx wrangler pages deploy build --project-name llm-council`)

Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

## Repositories

- **Primary**: [git.eduard3v.com/EduarD3V/LLM-Council](https://git.eduard3v.com/EduarD3V/LLM-Council)
- **Mirror**: [github.com/eduardez/LLM-Council](https://github.com/eduardez/LLM-Council)
