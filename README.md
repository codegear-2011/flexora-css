# ARTAPA CSS

**AI-optimized, zero-config, runtime CSS framework.**
Namespace-based class syntax (`layout:flex`, `font:size-lg`) + real-time in-browser CSS generation — no Node.js, Vite, or Webpack setup required.

## Two ways to use it

ARTAPA CSS ships in two forms — pick whichever fits your use case.

### Option 1: Runtime Engine (JS) — zero-config, recommended for development

```html
<script src="https://cdn.jsdelivr.net/gh/<your-username>/artapa-css@v0.1.0-beta.1/dist/core.min.js"></script>
```

Only the CSS for classes actually used on the page is generated in real time in the browser (powered by `MutationObserver`). Best for prototyping and trying out new namespaces/values quickly.

### Option 2: Static `artapa.css` — no JS, fastest for production

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<your-username>/artapa-css@v0.1.0-beta.1/dist/artapa.min.css">
```

A plain, pre-compiled CSS file — every namespace:value class is already written out (~2KB minified). No runtime JavaScript or MutationObserver needed; it works exactly like a normal `<link>` stylesheet, similar to Bootstrap's or Tailwind's compiled CSS output.

> `dist/artapa.css` and the `RULES` object inside `dist/core.js` are both generated from the same source (`src/core.js`) via `node build.js`, so they never fall out of sync.

Once loaded, just write ARTAPA classes on any element:

```html
<div class="layout:flex align:center justify:between padding:md border:radius-smooth border:color-slate">
  <h3 class="font:size-lg font:weight-semibold">ARTAPA Card</h3>
  <button class="bg:color-primary text:color-white padding:sm border:radius-smooth">Click</button>
</div>
```

## How it works
1. As soon as `core.min.js` loads, it scans the entire `<body>` and generates CSS for the classes in use, injecting them into a `<style id="artapa-runtime-style">` tag.
2. A `MutationObserver` detects new elements or class changes in the DOM in real time and adds the required rules on the fly.
3. Only rules for classes actually used are generated — the whole framework is never processed at once, so page performance stays fast.
4. Classes already processed are tracked in an internal `Set`, so edits are incremental — changing two lines of code doesn't recompile the whole stylesheet, only the new/changed classes are added.

## Color palette

11 colors × 5 shades each (100 / 300 / 500 / 700 / 900) — `slate`, `gray`, `red`, `orange`, `amber`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`. Applied across three namespaces:

```
bg:color-<name>-<shade>       e.g. bg:color-blue-500
text:color-<name>-<shade>     e.g. text:color-red-700
border:color-<name>-<shade>   e.g. border:color-green-300
```

```html
<button class="bg:color-blue-500 hover:bg:color-blue-700 text:color-white padding:sm border:radius-smooth">
  Save
</button>
```

The original short aliases (`bg:color-primary`, `text:color-white`, `border:color-slate`, etc.) are unchanged and still work.

## Spacing scale (padding / margin / gap)

Named scale: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`.

```html
<div class="padding:2xl margin:none gap:lg">
```

Arbitrary numeric values are also supported (`px`, `rem`, `em`, `%`) — JS runtime only:

```html
<div class="padding:24px margin:1.5rem gap:12px">
```

## Grid utilities

```
grid:cols-1..12       grid:rows-1..6
grid:col-span-1..12   grid:row-span-1..6
```

```html
<div class="layout:grid grid:cols-3 gap:md">
  <div class="grid:col-span-2">Wide item</div>
  <div>Item</div>
</div>
```

## Dark mode

Prefix any class with `dark:`. Default strategy toggles via a `.dark` ancestor class:

```html
<div class="bg:color-white dark:bg:color-slate-900 text:color-slate-900 dark:text:color-white">
```

Switch to automatic OS-based dark mode, or use a custom toggle class:
```js
ARTAPA.setDarkMode({ strategy: "media" });                      // follow prefers-color-scheme
ARTAPA.setDarkMode({ strategy: "class", selector: ".theme-dark" }); // custom class name
```

Combines with breakpoints/states in the JS runtime (`md:dark:hover:bg:color-blue-700`). The static build ships the default class-strategy only, uncombined.

## Production build — purge unused CSS

The static `dist/artapa.css` ships every possible class/variant (~130KB minified) because it can't know in advance what your project actually uses. For production, use the `artapa build` CLI instead — it scans your real project files, keeps only the classes actually found, and outputs a single small CSS file.

```bash
npx artapa build ./src ./public --out dist/artapa.purged.css
```

(or `node bin/artapa.js build ...` / `node purge.js ...` directly if not installed via npm)

```
📦 ARTAPA CSS purge report
   Files scanned:          2
   Distinct classes found: 24
   Recognized (kept):      21
   Unrecognized (skipped): 3
   Design tokens included: 14
   Output:                 dist/artapa.purged.css  (1528 bytes)
   Output (minified):      dist/artapa.purged.min.css  (1296 bytes)
```

It scans `class="..."` and `className="..."` attributes (HTML/JS/JSX/TS/TSX/Vue/Svelte/PHP by default — configurable with `--ext`), resolves each candidate through the same rule-generation logic the JS runtime uses (`ARTAPA._internal.buildRuleCSS`), and:
- keeps only classes it recognizes (breakpoints, states, dark mode, arbitrary spacing values — all handled correctly)
- flags anything it doesn't recognize (typos, hallucinated class names, or genuinely unrelated classes) in the report, without failing the build
- also picks up design tokens referenced directly via `var(--artapa-bg-color-red-500)`, even if no matching class exists in your markup
- writes both a readable and a minified CSS file

Then swap the runtime script tag for a plain stylesheet link:
```html
<link rel="stylesheet" href="dist/artapa.purged.min.css">
```

**Known limitation:** class names built dynamically at runtime (e.g. `className={\`bg:color-\${variant}\`}`) can't be statically detected — same caveat utility-first frameworks like Tailwind have. Write the full class name literally, or add it to a safelist (not yet implemented — see roadmap).

## Design Token Bridge

Every color, spacing, and radius value in ARTAPA is also exposed as a CSS custom property on `<html>`, so raw CSS outside of ARTAPA classes can reuse the exact same values.

```css
/* your own custom CSS, anywhere on the page */
.my-tooltip {
  background-color: var(--artapa-bg-color-blue-500);
  border-radius: var(--artapa-border-radius-smooth);
  padding: var(--artapa-padding-sm);
}
```

Token naming: replace every `:` in the class name with `-` and prefix with `--artapa-`. E.g. `bg:color-blue-500` → `--artapa-bg-color-blue-500`.

Only colors (`bg:color-*`, `text:color-*`, `border:color-*`), spacing (`padding:*`, `margin:*`, `gap:*`), and `border:radius-*` are exposed as tokens — structural namespaces like `layout:` or `grid:` are not, since they aren't really "design values."

```js
ARTAPA.getToken("bg:color-blue-500");  // -> "#3b82f6"
ARTAPA.applyDesignTokens();            // re-apply after adding new rules via extend()
```

Tokens are applied automatically on `ARTAPA.init()` in the JS runtime, and shipped as a `:root{...}` block at the top of the static `artapa.css` build — both stay in sync with the same `RULES` source.

## Interactive states (hover / focus / active)

Prefix any class with a state name: `[state]:[namespace]:[value]`.

| Prefix | Pseudo-class |
|---|---|
| `hover:` | `:hover` |
| `focus:` | `:focus` |
| `active:` | `:active` |

```html
<button class="bg:color-primary hover:bg:color-slate padding:sm border:radius-smooth">
  Click me
</button>
```

State and breakpoint prefixes can be combined in the JS runtime (e.g. `md:hover:bg:color-primary`). The static `artapa.css` build includes each prefix type separately but not combined, to keep file size down — use the JS runtime engine if you need combined prefixes.

## Responsive breakpoints

Prefix any class with a breakpoint name: `[breakpoint]:[namespace]:[value]`. Mobile-first (`min-width`), same convention as Tailwind's prefixes but keeping ARTAPA's namespace grammar.

| Prefix | Min-width |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

```html
<div class="layout:col md:layout:row lg:justify:between">
  <!-- column on mobile, row from 768px, spaced-out from 1024px -->
</div>
```

Works identically whether you're using the JS runtime or the static `artapa.css` — both are generated from the same `BREAKPOINTS` config in `src/core.js`.

## Public API

```js
ARTAPA.init(rootEl)          // Start/restart the engine (auto-starts by default)
ARTAPA.scan(rootEl)          // Manually scan a specific subtree
ARTAPA.extend({ "spacing:xxl": "padding:48px;" }) // Add new rules at runtime
ARTAPA.setBreakpoint("xs", 480)  // Add/override a breakpoint at runtime
ARTAPA.setState("disabled", ":disabled") // Add/override a state at runtime
ARTAPA.setDarkMode({ strategy: "media" }) // Switch dark mode strategy
ARTAPA.getToken("bg:color-blue-500") // Read a design token's current value
ARTAPA.applyDesignTokens() // Re-apply CSS variable tokens (e.g. after extend())
ARTAPA.getGeneratedCSS()     // Get the CSS generated so far, as text
ARTAPA.getUnknownClasses()   // Classes not found in the dictionary (helps catch hallucinated class names)
ARTAPA.stop()                // Disconnect the MutationObserver
```

To disable auto-init:
```html
<script src=".../core.min.js" data-auto="false"></script>
<script>ARTAPA.init(document.getElementById("app"));</script>
```

## For AI coding assistants
Give your AI code assistant (Cursor, VS Code Copilot, etc.) the `ai-rules.md` file — it's the complete namespace/value reference for ARTAPA, so the AI won't hallucinate invalid class names.

## Project structure
```
artapa-css/
├── package.json          # bin: "artapa" CLI entry, npm scripts
├── bin/artapa.js          # CLI dispatcher (artapa build, artapa --help)
├── purge.js               # production purge tool implementation (also runnable directly)
├── src/core.js            # Source of truth — RULES dictionary + runtime engine
├── build.js               # Generates dist/artapa.css from src/core.js
├── dist/core.js           # Unminified runtime engine
├── dist/core.min.js       # Minified runtime engine — use this on CDN (~17KB)
├── dist/artapa.css        # Static pre-compiled CSS, everything included (readable)
├── dist/artapa.min.css    # Static pre-compiled CSS, everything included (minified)
└── ai-rules.md            # AI context document
```

To add a new namespace/value, edit the `RULES` object in `src/core.js`, then run `node build.js` — `dist/artapa.css` updates automatically.

## Automated builds (GitHub Actions)

A workflow at `.github/workflows/build.yml` rebuilds `dist/core.min.js`, `dist/artapa.css`, and `dist/artapa.min.css` automatically whenever `src/core.js` or `build.js` changes on `main`, and commits the updated files back to the repo. You never need to run the build manually after pushing a source change — just edit `src/core.js` and push.

To trigger it manually instead (e.g. to test it), go to the repo's **Actions** tab → **Build ARTAPA CSS** → **Run workflow**.

No local setup is required to build — the workflow installs `terser` itself in CI.

## Roadmap
- [x] Responsive breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- [x] State variants (`hover:`, `focus:`, `active:`)
- [x] Extended color palette (11 colors × 5 shades)
- [x] Expanded spacing scale + arbitrary numeric values (padding/margin/gap)
- [x] Grid utilities (`grid:cols-N`, `grid:col-span-N`, etc.)
- [x] Dark mode (`dark:` prefix, class or media strategy)
- [x] Design Token Bridge (color/spacing/radius exposed as `--artapa-*` CSS variables)
- [x] **Production build/purge tool** (`purge.js`) — scans real project files, outputs only the CSS actually in use
- [ ] Safelist support for dynamically-constructed class names
- [ ] Theme config file (color palette overrides)

## License
MIT
