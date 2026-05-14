# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server on port 5173
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
```

**Deploy to GitHub Pages** (after build):
```bash
PATH="/Users/nikitashulaev/.local/node/bin:$PATH" npx gh-pages -d dist
```

CI auto-deploys on push to `main` via `.github/workflows/deploy.yml`.

## Architecture

Single-file React 19 app: **`freedom-v6.jsx`** (~2000 lines). Entry point `src/main.jsx` renders `<FreedomV6 />`.

### Structure within freedom-v6.jsx

1. **Data layer** (top) — hardcoded mock data: `RAW_ACCOUNTS`, `CARDS`, `STORIES`, `DEPOSITS`, `BROKER_ACCOUNTS`, `NEWS`, currency rates, etc. Empty state has its own `EMPTY_RAW_ACCOUNTS` and `EMPTY_CARDS`.
2. **Utility functions** — `fmtFull()`, `fmtCompact()`, `convertTo()` for currency formatting/conversion.
3. **Sub-components** — `StoriesRow`, `BentoGrid`, `CurrencyPicker` (inline, not separate files).
4. **`BottomSheet`** — debug constructor: theme switcher, empty state toggle, block visibility toggles, drag-and-drop block reordering.
5. **`StripeThemeApp`** — the main screen UI. Receives all state as props. Renders 11 modular blocks controlled by `blockVis` (visibility) and `blockOrder` (ordering).
6. **`FreedomV6`** (default export) — root component. Owns all state, computes `wallets`/`totalInKZT` from accounts, renders theme branch + BottomSheet.

### Modular block system

Blocks are defined in `BLOCK_LABELS` array. Each block:
- Has a key (e.g., `"balance"`, `"recentTransfers"`, `"products"`)
- Can be toggled on/off via `blockVis[key]`
- Is ordered via `blockOrder` array (CSS `order` property)
- Renders conditionally: `{blockVis.someBlock && (<div style={{ order: blockOrder.indexOf("someBlock") }}>...</div>)}`

### Two states

- **Full state** — active user with multiple accounts, cards, transactions, deposits, broker
- **Empty state** (`emptyState` boolean) — new user: 1 card, 0₸ balance, onboarding card replaces contacts, example amounts in deposit nudge, empty placeholders with CTAs in products

### Theming

Two themes via `theme` state: `"stripe"` (light) and `"dark"`. Color palettes in `LIGHT_COLORS` and `DARK_COLORS` objects. Both themes use the same `StripeThemeApp` component with colors passed as `C` prop.

## Conventions

- All styling is inline CSS (no CSS files, no CSS-in-JS libraries)
- Interactive elements use `data-press` attribute for press feedback
- Russian language throughout the UI
- Icons from `lucide-react`
- GitHub Pages base path: `/banker-app-prototype/`
