# ARTAPA CSS — AI Context Rules

You (the AI coding assistant) are working in a project that uses **ARTAPA CSS**. Never use Tailwind or any other framework's class names.

## Syntax rule
```
[namespace]:[property]-[value]
```
- Always follow the `namespace:value` format (e.g. `layout:flex`, `font:size-lg`).
- Multiple classes are space-separated, just like Tailwind — only the names are object-style.
- Only use namespaces and values from the table below. Do not invent new namespaces.

## Allowed Namespaces & Values (v0.1.0)

| Namespace | Possible values | Example |
|---|---|---|
| `layout:` | flex, inline-flex, grid, block, hidden, col, row, wrap | `layout:flex` |
| `align:` | center, start, end, stretch | `align:center` |
| `justify:` | between, center, start, end, around | `justify:between` |
| `font:` | size-xs/sm/md/lg/xl, weight-normal/medium/semibold/bold | `font:size-lg` |
| `text:` | align-center/left/right, spacing-wide, color-white/black/slate | `text:color-slate` |
| `border:` | radius-none/sm/smooth/full, color-slate, color-none | `border:radius-smooth` |
| `padding:` | xs, sm, md, lg, xl | `padding:md` |
| `margin:` | xs, sm, md, lg, auto | `margin:auto` |
| `bg:` | color-primary, color-slate, color-white, color-transparent | `bg:color-primary` |
| `size:` | w-full, h-full, w-auto | `size:w-full` |

## Color palette

11 colors × 5 shades (100/300/500/700/900), available under `bg:color-`, `text:color-`, and `border:color-`.

| Colors |
|---|
| `slate`, `gray`, `red`, `orange`, `amber`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink` |

```
bg:color-blue-500      text:color-red-700      border:color-green-300
```

Example:
```html
<div class="bg:color-slate-100 text:color-slate-900 border:color-slate-300">
  <button class="bg:color-blue-500 hover:bg:color-blue-700 text:color-white">Save</button>
</div>
```

> The original short names (`bg:color-primary`, `bg:color-slate`, `border:color-slate`, `text:color-white`, etc.) still work — they're kept as convenience aliases alongside the full shade scale.

## Spacing scale

The named scale now includes `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` — for `padding:`, `margin:`, and `gap:`.

```html
<div class="padding:2xl margin:none gap:lg">
```

**Arbitrary values** are also supported for `padding:`, `margin:`, and `gap:` — write any number with a unit (`px`, `rem`, `em`, `%`):

```html
<div class="padding:24px margin:1.5rem gap:12px">
```

> Arbitrary numeric values only work in the JS runtime engine — the static `artapa.css` build can only enumerate the named scale, not every possible number.

## Grid utilities

```
grid:cols-1 … grid:cols-12        grid-template-columns: repeat(N, minmax(0, 1fr))
grid:rows-1 … grid:rows-6         grid-template-rows: repeat(N, minmax(0, 1fr))
grid:col-span-1 … grid:col-span-12  grid-column: span N / span N
grid:row-span-1 … grid:row-span-6   grid-row: span N / span N
```

```html
<div class="layout:grid grid:cols-3 gap:md">
  <div class="grid:col-span-2">Wide item</div>
  <div>Item</div>
</div>
```

## Dark mode

Prefix any class with `dark:`. Two strategies, switchable at runtime:

- **`class` (default)** — generates `.dark .dark\:bg\:color-slate-900{...}`. Toggle by adding/removing a `dark` class on `<html>` or `<body>` (e.g. via a theme switcher button).
- **`media`** — generates `@media (prefers-color-scheme:dark){...}`. Automatically follows the OS/browser setting.

```html
<div class="bg:color-white dark:bg:color-slate-900 text:color-slate-900 dark:text:color-white">
```

```js
// switch to automatic OS-based dark mode
ARTAPA.setDarkMode({ strategy: "media" });

// or use a custom toggle class instead of "dark"
ARTAPA.setDarkMode({ strategy: "class", selector: ".theme-dark" });
```

`dark:` can combine with breakpoint and state prefixes in the JS runtime, e.g. `md:dark:hover:bg:color-blue-700`. The static build only ships the default `class` strategy on its own (not combined with breakpoints/states).

## Not allowed
- Tailwind-style shorthand names (`p-2`, `mb-4`, `rounded-lg`).
- Values not in the table above (hallucinated values) — e.g. `pad-2`, `border-sm` are invalid.
- Inline `style=""` attributes — always use ARTAPA classes instead.

## Example (correct output)
```html
<div class="layout:flex align:center justify:between padding:md border:radius-smooth border:color-slate">
  <h3 class="font:size-lg font:weight-semibold">Card Title</h3>
  <button class="bg:color-primary text:color-white padding:sm border:radius-smooth">Click</button>
</div>
```

## Interactive states (hover / focus / active)
Prefix any class with a state name: `[state]:[namespace]:[value]`.

| Prefix | Pseudo-class |
|---|---|
| `hover:` | `:hover` |
| `focus:` | `:focus` |
| `active:` | `:active` |

```html
<button class="bg:color-primary hover:bg:color-slate padding:sm border:radius-smooth">
```

State and breakpoint prefixes can combine (JS runtime only — see note below): `md:hover:bg:color-primary`.

## Responsive breakpoints
Prefix any class with a breakpoint name and a colon: `[breakpoint]:[namespace]:[value]`. Rules apply from that screen width upward (mobile-first, `min-width`).

| Breakpoint | Min-width |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

Example:
```html
<div class="layout:col md:layout:row lg:justify:between">
```
This stacks vertically by default, switches to a row at 768px, and spaces items apart at 1024px.

> Note: the static `artapa.css` build includes breakpoint variants and state variants (hover/focus/active) separately, but not combined (e.g. `md:hover:bg:color-primary`) — that combination only works with the JS runtime engine, to keep the static file size reasonable.

## Extending the rule set
If a required namespace/value isn't in the table, tell the user that new rules can be added at runtime via `ARTAPA.extend({...})` — don't invent a new class name on your own.
