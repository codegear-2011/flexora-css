/*!
 * ARTAPA CSS v0.1.0-beta.1
 * Runtime On-Demand CSS Generation Engine — AI-Optimized Namespace Syntax
 * https://github.com/<your-username>/artapa-css
 * License: MIT
 *
 * CDN usage:
 * <script src="https://cdn.jsdelivr.net/gh/<user>/artapa-css/dist/core.min.js"></script>
 *
 * Syntax: [namespace]:[property]-[value]
 * Examples: layout:flex, font:size-lg, border:radius-smooth
 */
(function (global) {
  "use strict";

  // =========================================================
  // 1. RULE DICTIONARY — namespace:property-value -> CSS declaration
  //    This is where the entire framework grows from. To add a new
  //    namespace or value, just add an entry to this object.
  // =========================================================
  const RULES = {
    // ---- layout ----
    "layout:flex": "display:flex;",
    "layout:inline-flex": "display:inline-flex;",
    "layout:grid": "display:grid;",
    "layout:block": "display:block;",
    "layout:hidden": "display:none;",
    "layout:col": "flex-direction:column;",
    "layout:row": "flex-direction:row;",
    "layout:wrap": "flex-wrap:wrap;",

    // ---- align / justify ----
    "align:center": "align-items:center;",
    "align:start": "align-items:flex-start;",
    "align:end": "align-items:flex-end;",
    "align:stretch": "align-items:stretch;",
    "justify:between": "justify-content:space-between;",
    "justify:center": "justify-content:center;",
    "justify:start": "justify-content:flex-start;",
    "justify:end": "justify-content:flex-end;",
    "justify:around": "justify-content:space-around;",

    // ---- font / text ----
    "font:size-xs": "font-size:12px;",
    "font:size-sm": "font-size:14px;",
    "font:size-md": "font-size:16px;",
    "font:size-lg": "font-size:20px;",
    "font:size-xl": "font-size:28px;",
    "font:weight-normal": "font-weight:400;",
    "font:weight-medium": "font-weight:500;",
    "font:weight-semibold": "font-weight:600;",
    "font:weight-bold": "font-weight:700;",
    "text:align-center": "text-align:center;",
    "text:align-left": "text-align:left;",
    "text:align-right": "text-align:right;",
    "text:spacing-wide": "letter-spacing:0.05em;",
    "text:color-white": "color:#ffffff;",
    "text:color-black": "color:#0f172a;",
    "text:color-slate": "color:#64748b;",

    // ---- border ----
    "border:radius-none": "border-radius:0;",
    "border:radius-sm": "border-radius:4px;",
    "border:radius-smooth": "border-radius:10px;",
    "border:radius-full": "border-radius:9999px;",
    "border:color-slate": "border:1px solid #cbd5e1;",
    "border:color-none": "border:none;",

    // ---- spacing (padding / margin / gap) ----
    "padding:none": "padding:0;",
    "padding:xs": "padding:4px;",
    "padding:sm": "padding:8px;",
    "padding:md": "padding:16px;",
    "padding:lg": "padding:24px;",
    "padding:xl": "padding:32px;",
    "padding:2xl": "padding:48px;",
    "padding:3xl": "padding:64px;",
    "margin:none": "margin:0;",
    "margin:xs": "margin:4px;",
    "margin:sm": "margin:8px;",
    "margin:md": "margin:16px;",
    "margin:lg": "margin:24px;",
    "margin:xl": "margin:32px;",
    "margin:2xl": "margin:48px;",
    "margin:3xl": "margin:64px;",
    "margin:auto": "margin:auto;",
    "gap:xs": "gap:4px;",
    "gap:sm": "gap:8px;",
    "gap:md": "gap:16px;",
    "gap:lg": "gap:24px;",
    "gap:xl": "gap:32px;",
    "gap:2xl": "gap:48px;",

    // ---- background ----
    "bg:color-primary": "background-color:#38bdf8;",
    "bg:color-slate": "background-color:#1e293b;",
    "bg:color-white": "background-color:#ffffff;",
    "bg:color-transparent": "background-color:transparent;",

    // ---- extended color palette (11 colors x 5 shades) ----
    // ---- slate ----
    "bg:color-slate-100": "background-color:#f1f5f9;",
    "bg:color-slate-300": "background-color:#cbd5e1;",
    "bg:color-slate-500": "background-color:#64748b;",
    "bg:color-slate-700": "background-color:#334155;",
    "bg:color-slate-900": "background-color:#0f172a;",
    "text:color-slate-100": "color:#f1f5f9;",
    "text:color-slate-300": "color:#cbd5e1;",
    "text:color-slate-500": "color:#64748b;",
    "text:color-slate-700": "color:#334155;",
    "text:color-slate-900": "color:#0f172a;",
    "border:color-slate-100": "border-color:#f1f5f9;",
    "border:color-slate-300": "border-color:#cbd5e1;",
    "border:color-slate-500": "border-color:#64748b;",
    "border:color-slate-700": "border-color:#334155;",
    "border:color-slate-900": "border-color:#0f172a;",
    // ---- gray ----
    "bg:color-gray-100": "background-color:#f3f4f6;",
    "bg:color-gray-300": "background-color:#d1d5db;",
    "bg:color-gray-500": "background-color:#6b7280;",
    "bg:color-gray-700": "background-color:#374151;",
    "bg:color-gray-900": "background-color:#111827;",
    "text:color-gray-100": "color:#f3f4f6;",
    "text:color-gray-300": "color:#d1d5db;",
    "text:color-gray-500": "color:#6b7280;",
    "text:color-gray-700": "color:#374151;",
    "text:color-gray-900": "color:#111827;",
    "border:color-gray-100": "border-color:#f3f4f6;",
    "border:color-gray-300": "border-color:#d1d5db;",
    "border:color-gray-500": "border-color:#6b7280;",
    "border:color-gray-700": "border-color:#374151;",
    "border:color-gray-900": "border-color:#111827;",
    // ---- red ----
    "bg:color-red-100": "background-color:#fee2e2;",
    "bg:color-red-300": "background-color:#fca5a5;",
    "bg:color-red-500": "background-color:#ef4444;",
    "bg:color-red-700": "background-color:#b91c1c;",
    "bg:color-red-900": "background-color:#7f1d1d;",
    "text:color-red-100": "color:#fee2e2;",
    "text:color-red-300": "color:#fca5a5;",
    "text:color-red-500": "color:#ef4444;",
    "text:color-red-700": "color:#b91c1c;",
    "text:color-red-900": "color:#7f1d1d;",
    "border:color-red-100": "border-color:#fee2e2;",
    "border:color-red-300": "border-color:#fca5a5;",
    "border:color-red-500": "border-color:#ef4444;",
    "border:color-red-700": "border-color:#b91c1c;",
    "border:color-red-900": "border-color:#7f1d1d;",
    // ---- orange ----
    "bg:color-orange-100": "background-color:#ffedd5;",
    "bg:color-orange-300": "background-color:#fdba74;",
    "bg:color-orange-500": "background-color:#f97316;",
    "bg:color-orange-700": "background-color:#c2410c;",
    "bg:color-orange-900": "background-color:#7c2d12;",
    "text:color-orange-100": "color:#ffedd5;",
    "text:color-orange-300": "color:#fdba74;",
    "text:color-orange-500": "color:#f97316;",
    "text:color-orange-700": "color:#c2410c;",
    "text:color-orange-900": "color:#7c2d12;",
    "border:color-orange-100": "border-color:#ffedd5;",
    "border:color-orange-300": "border-color:#fdba74;",
    "border:color-orange-500": "border-color:#f97316;",
    "border:color-orange-700": "border-color:#c2410c;",
    "border:color-orange-900": "border-color:#7c2d12;",
    // ---- amber ----
    "bg:color-amber-100": "background-color:#fef3c7;",
    "bg:color-amber-300": "background-color:#fcd34d;",
    "bg:color-amber-500": "background-color:#f59e0b;",
    "bg:color-amber-700": "background-color:#b45309;",
    "bg:color-amber-900": "background-color:#78350f;",
    "text:color-amber-100": "color:#fef3c7;",
    "text:color-amber-300": "color:#fcd34d;",
    "text:color-amber-500": "color:#f59e0b;",
    "text:color-amber-700": "color:#b45309;",
    "text:color-amber-900": "color:#78350f;",
    "border:color-amber-100": "border-color:#fef3c7;",
    "border:color-amber-300": "border-color:#fcd34d;",
    "border:color-amber-500": "border-color:#f59e0b;",
    "border:color-amber-700": "border-color:#b45309;",
    "border:color-amber-900": "border-color:#78350f;",
    // ---- green ----
    "bg:color-green-100": "background-color:#dcfce7;",
    "bg:color-green-300": "background-color:#86efac;",
    "bg:color-green-500": "background-color:#22c55e;",
    "bg:color-green-700": "background-color:#15803d;",
    "bg:color-green-900": "background-color:#14532d;",
    "text:color-green-100": "color:#dcfce7;",
    "text:color-green-300": "color:#86efac;",
    "text:color-green-500": "color:#22c55e;",
    "text:color-green-700": "color:#15803d;",
    "text:color-green-900": "color:#14532d;",
    "border:color-green-100": "border-color:#dcfce7;",
    "border:color-green-300": "border-color:#86efac;",
    "border:color-green-500": "border-color:#22c55e;",
    "border:color-green-700": "border-color:#15803d;",
    "border:color-green-900": "border-color:#14532d;",
    // ---- teal ----
    "bg:color-teal-100": "background-color:#ccfbf1;",
    "bg:color-teal-300": "background-color:#5eead4;",
    "bg:color-teal-500": "background-color:#14b8a6;",
    "bg:color-teal-700": "background-color:#0f766e;",
    "bg:color-teal-900": "background-color:#134e4a;",
    "text:color-teal-100": "color:#ccfbf1;",
    "text:color-teal-300": "color:#5eead4;",
    "text:color-teal-500": "color:#14b8a6;",
    "text:color-teal-700": "color:#0f766e;",
    "text:color-teal-900": "color:#134e4a;",
    "border:color-teal-100": "border-color:#ccfbf1;",
    "border:color-teal-300": "border-color:#5eead4;",
    "border:color-teal-500": "border-color:#14b8a6;",
    "border:color-teal-700": "border-color:#0f766e;",
    "border:color-teal-900": "border-color:#134e4a;",
    // ---- blue ----
    "bg:color-blue-100": "background-color:#dbeafe;",
    "bg:color-blue-300": "background-color:#93c5fd;",
    "bg:color-blue-500": "background-color:#3b82f6;",
    "bg:color-blue-700": "background-color:#1d4ed8;",
    "bg:color-blue-900": "background-color:#1e3a8a;",
    "text:color-blue-100": "color:#dbeafe;",
    "text:color-blue-300": "color:#93c5fd;",
    "text:color-blue-500": "color:#3b82f6;",
    "text:color-blue-700": "color:#1d4ed8;",
    "text:color-blue-900": "color:#1e3a8a;",
    "border:color-blue-100": "border-color:#dbeafe;",
    "border:color-blue-300": "border-color:#93c5fd;",
    "border:color-blue-500": "border-color:#3b82f6;",
    "border:color-blue-700": "border-color:#1d4ed8;",
    "border:color-blue-900": "border-color:#1e3a8a;",
    // ---- indigo ----
    "bg:color-indigo-100": "background-color:#e0e7ff;",
    "bg:color-indigo-300": "background-color:#a5b4fc;",
    "bg:color-indigo-500": "background-color:#6366f1;",
    "bg:color-indigo-700": "background-color:#4338ca;",
    "bg:color-indigo-900": "background-color:#312e81;",
    "text:color-indigo-100": "color:#e0e7ff;",
    "text:color-indigo-300": "color:#a5b4fc;",
    "text:color-indigo-500": "color:#6366f1;",
    "text:color-indigo-700": "color:#4338ca;",
    "text:color-indigo-900": "color:#312e81;",
    "border:color-indigo-100": "border-color:#e0e7ff;",
    "border:color-indigo-300": "border-color:#a5b4fc;",
    "border:color-indigo-500": "border-color:#6366f1;",
    "border:color-indigo-700": "border-color:#4338ca;",
    "border:color-indigo-900": "border-color:#312e81;",
    // ---- purple ----
    "bg:color-purple-100": "background-color:#f3e8ff;",
    "bg:color-purple-300": "background-color:#d8b4fe;",
    "bg:color-purple-500": "background-color:#a855f7;",
    "bg:color-purple-700": "background-color:#7e22ce;",
    "bg:color-purple-900": "background-color:#581c87;",
    "text:color-purple-100": "color:#f3e8ff;",
    "text:color-purple-300": "color:#d8b4fe;",
    "text:color-purple-500": "color:#a855f7;",
    "text:color-purple-700": "color:#7e22ce;",
    "text:color-purple-900": "color:#581c87;",
    "border:color-purple-100": "border-color:#f3e8ff;",
    "border:color-purple-300": "border-color:#d8b4fe;",
    "border:color-purple-500": "border-color:#a855f7;",
    "border:color-purple-700": "border-color:#7e22ce;",
    "border:color-purple-900": "border-color:#581c87;",
    // ---- pink ----
    "bg:color-pink-100": "background-color:#fce7f3;",
    "bg:color-pink-300": "background-color:#f9a8d4;",
    "bg:color-pink-500": "background-color:#ec4899;",
    "bg:color-pink-700": "background-color:#be185d;",
    "bg:color-pink-900": "background-color:#831843;",
    "text:color-pink-100": "color:#fce7f3;",
    "text:color-pink-300": "color:#f9a8d4;",
    "text:color-pink-500": "color:#ec4899;",
    "text:color-pink-700": "color:#be185d;",
    "text:color-pink-900": "color:#831843;",
    "border:color-pink-100": "border-color:#fce7f3;",
    "border:color-pink-300": "border-color:#f9a8d4;",
    "border:color-pink-500": "border-color:#ec4899;",
    "border:color-pink-700": "border-color:#be185d;",
    "border:color-pink-900": "border-color:#831843;",

    // ---- grid ----
    "grid:cols-1": "grid-template-columns:repeat(1, minmax(0, 1fr));",
    "grid:cols-2": "grid-template-columns:repeat(2, minmax(0, 1fr));",
    "grid:cols-3": "grid-template-columns:repeat(3, minmax(0, 1fr));",
    "grid:cols-4": "grid-template-columns:repeat(4, minmax(0, 1fr));",
    "grid:cols-5": "grid-template-columns:repeat(5, minmax(0, 1fr));",
    "grid:cols-6": "grid-template-columns:repeat(6, minmax(0, 1fr));",
    "grid:cols-7": "grid-template-columns:repeat(7, minmax(0, 1fr));",
    "grid:cols-8": "grid-template-columns:repeat(8, minmax(0, 1fr));",
    "grid:cols-9": "grid-template-columns:repeat(9, minmax(0, 1fr));",
    "grid:cols-10": "grid-template-columns:repeat(10, minmax(0, 1fr));",
    "grid:cols-11": "grid-template-columns:repeat(11, minmax(0, 1fr));",
    "grid:cols-12": "grid-template-columns:repeat(12, minmax(0, 1fr));",
    "grid:rows-1": "grid-template-rows:repeat(1, minmax(0, 1fr));",
    "grid:rows-2": "grid-template-rows:repeat(2, minmax(0, 1fr));",
    "grid:rows-3": "grid-template-rows:repeat(3, minmax(0, 1fr));",
    "grid:rows-4": "grid-template-rows:repeat(4, minmax(0, 1fr));",
    "grid:rows-5": "grid-template-rows:repeat(5, minmax(0, 1fr));",
    "grid:rows-6": "grid-template-rows:repeat(6, minmax(0, 1fr));",
    "grid:col-span-1": "grid-column:span 1 / span 1;",
    "grid:col-span-2": "grid-column:span 2 / span 2;",
    "grid:col-span-3": "grid-column:span 3 / span 3;",
    "grid:col-span-4": "grid-column:span 4 / span 4;",
    "grid:col-span-5": "grid-column:span 5 / span 5;",
    "grid:col-span-6": "grid-column:span 6 / span 6;",
    "grid:col-span-7": "grid-column:span 7 / span 7;",
    "grid:col-span-8": "grid-column:span 8 / span 8;",
    "grid:col-span-9": "grid-column:span 9 / span 9;",
    "grid:col-span-10": "grid-column:span 10 / span 10;",
    "grid:col-span-11": "grid-column:span 11 / span 11;",
    "grid:col-span-12": "grid-column:span 12 / span 12;",
    "grid:row-span-1": "grid-row:span 1 / span 1;",
    "grid:row-span-2": "grid-row:span 2 / span 2;",
    "grid:row-span-3": "grid-row:span 3 / span 3;",
    "grid:row-span-4": "grid-row:span 4 / span 4;",
    "grid:row-span-5": "grid-row:span 5 / span 5;",
    "grid:row-span-6": "grid-row:span 6 / span 6;",

    // ---- sizing ----
    "size:w-full": "width:100%;",
    "size:h-full": "height:100%;",
    "size:w-auto": "width:auto;",
  };

  // =========================================================
  // 1b. BREAKPOINTS — responsive prefix support
  //     Syntax: [breakpoint]:[namespace]:[value]
  //     Examples: md:layout:flex, lg:font:size-xl
  //     Uses min-width media queries (mobile-first, same convention as Tailwind)
  // =========================================================
  const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  };

  // =========================================================
  // 1c. STATES — hover/focus/active pseudo-class support
  //     Syntax: [state]:[namespace]:[value]
  //     Examples: hover:bg:color-primary, focus:border:color-slate
  //     Can be combined with a breakpoint prefix in the JS runtime,
  //     e.g. md:hover:bg:color-primary
  // =========================================================
  const STATES = {
    hover: ":hover",
    focus: ":focus",
    active: ":active",
  };

  // =========================================================
  // 1d. DARK MODE
  //     Syntax: dark:[namespace]:[value]
  //     Example: dark:bg:color-slate-900, dark:text:color-white
  //     Two strategies:
  //       - "class" (default): generates ".dark .dark\:bg\:color-slate-900{...}"
  //         Toggle by adding/removing a "dark" class on <html> or <body>.
  //       - "media": generates "@media (prefers-color-scheme:dark){...}"
  //         Automatically follows the OS/browser color scheme.
  //     Change strategy at runtime with ARTAPA.setDarkMode({ strategy: "media" })
  //     or override the ancestor selector with { selector: ".theme-dark" }.
  // =========================================================
  const DARK_SELECTOR_DEFAULT = ".dark";
  const DARK = {
    strategy: "class", // "class" | "media"
    selector: DARK_SELECTOR_DEFAULT,
  };

  // =========================================================
  // 1e. DYNAMIC VALUE MATCHERS
  //     Lets padding / margin / gap accept an arbitrary numeric value
  //     (e.g. padding:24px, margin:2rem, gap:1.5em) instead of only the
  //     named scale (xs/sm/md/lg/xl/2xl/3xl). Checked only when the class
  //     isn't already a literal key in RULES.
  //     Note: arbitrary values like this only work in the JS runtime —
  //     the static artapa.css build can't enumerate infinite numbers, so
  //     it only ships the named scale.
  // =========================================================
  const DYNAMIC_MATCHERS = [
    { property: "padding", regex: /^padding:(\d+(?:\.\d+)?)(px|rem|em|%)$/ },
    { property: "margin", regex: /^margin:(\d+(?:\.\d+)?)(px|rem|em|%)$/ },
    { property: "gap", regex: /^gap:(\d+(?:\.\d+)?)(px|rem|em|%)$/ },
  ];

  function tryDynamicRule(baseClass) {
    for (const matcher of DYNAMIC_MATCHERS) {
      const m = baseClass.match(matcher.regex);
      if (m) return `${matcher.property}:${m[1]}${m[2]};`;
    }
    return null;
  }

  // Parses a class string into { breakpoint, state, dark, baseClass }.
  // Prefixes (breakpoint / state / "dark") can appear in any order, any
  // combination, or not at all.
  function parseClass(cls) {
    const parts = cls.split(":");
    let breakpoint = null;
    let state = null;
    let dark = false;
    let idx = 0;
    // Stop once only "namespace:value" (2 parts) remains, so we never
    // consume the actual rule key while looking for prefixes.
    while (idx < parts.length - 2) {
      const piece = parts[idx];
      if (!breakpoint && BREAKPOINTS.hasOwnProperty(piece)) {
        breakpoint = piece;
        idx++;
        continue;
      }
      if (!state && STATES.hasOwnProperty(piece)) {
        state = piece;
        idx++;
        continue;
      }
      if (!dark && piece === "dark") {
        dark = true;
        idx++;
        continue;
      }
      break;
    }
    return { breakpoint, state, dark, baseClass: parts.slice(idx).join(":") };
  }

  // =========================================================
  // 2. STATE
  // =========================================================
  const injected = new Set();
  const unknown = new Set(); // tracks unknown / hallucinated class names
  let styleEl = null;
  let observer = null;

  function cssEscape(cls) {
    return "." + cls.replace(/[:]/g, "\\$&");
  }

  // ---- simple Levenshtein distance, used for "did you mean...?" suggestions ----
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[m][n];
  }

  // Finds the closest known class to baseClass (edit distance <= 3)
  function suggestClosest(baseClass) {
    let best = null;
    let bestDist = Infinity;
    for (const known of Object.keys(RULES)) {
      const d = levenshtein(baseClass, known);
      if (d < bestDist) {
        bestDist = d;
        best = known;
      }
    }
    return bestDist <= 3 ? best : null;
  }

  // Returns the set of valid namespaces (the part before the first ":")
  // so the warning message can distinguish between "namespace is wrong"
  // and "namespace is fine, but the value isn't".
  function knownNamespaces() {
    const set = new Set();
    for (const key of Object.keys(RULES)) set.add(key.split(":")[0]);
    return set;
  }

  function ensureStyleTag() {
    if (styleEl) return styleEl;
    styleEl = document.getElementById("artapa-runtime-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "artapa-runtime-style";
      document.head.appendChild(styleEl);
    }
    return styleEl;
  }

  // Builds a clear, actionable console warning for an unrecognized class.
  // It distinguishes between an invalid namespace and a valid namespace
  // with an invalid value, and offers a "did you mean...?" suggestion
  // when a close match exists (helpful for typos and AI hallucinations).
  function warnUnknownClass(fullClass, baseClass) {
    const hasNamespace = baseClass.includes(":");
    const ns = hasNamespace ? baseClass.split(":")[0] : null;
    const validNamespaces = knownNamespaces();
    const suggestion = suggestClosest(baseClass);

    let reason;
    if (!hasNamespace) {
      reason = `it isn't in "namespace:value" format (no ":" found). Valid namespaces: ${Array.from(validNamespaces).join(", ")}`;
    } else if (!validNamespaces.has(ns)) {
      reason = `namespace "${ns}:" doesn't exist in ARTAPA CSS. Valid namespaces: ${Array.from(validNamespaces).join(", ")}`;
    } else {
      reason = `namespace "${ns}:" is valid, but the value/property part isn't recognized.`;
    }

    let msg = `[ARTAPA CSS] ⚠ Unknown class "${fullClass}"\n  Reason: ${reason}`;
    if (suggestion) msg += `\n  Did you mean "${suggestion}"?`;
    msg += `\n  See ai-rules.md for the full list of valid namespace:value combinations.`;

    console.warn(msg);
  }

  // Pure function: given a full class string, returns the CSS rule text
  // (including any @media wrapper) or null if the class is unrecognized.
  // No DOM access — this is the single source of truth for "what CSS does
  // this class produce," reused by both the browser runtime (injectRule)
  // and the Node.js purge tool (purge.js), so their output can never diverge.
  function buildRuleCSS(cls) {
    const { breakpoint, state, dark, baseClass } = parseClass(cls);
    const decl = RULES[baseClass] || tryDynamicRule(baseClass);
    if (!decl) return null;

    const pseudo = state ? STATES[state] : "";
    let selector = `${cssEscape(cls)}${pseudo}`;
    if (dark && DARK.strategy === "class") {
      selector = `${DARK.selector} ${selector}`;
    }
    const mediaConditions = [];
    if (breakpoint) mediaConditions.push(`(min-width:${BREAKPOINTS[breakpoint]}px)`);
    if (dark && DARK.strategy === "media") mediaConditions.push("(prefers-color-scheme:dark)");

    const baseRule = `${selector}{${decl}}`;
    return mediaConditions.length
      ? `@media ${mediaConditions.join(" and ")}{${baseRule}}`
      : baseRule;
  }

  function injectRule(cls) {
    if (injected.has(cls)) return;
    const css = buildRuleCSS(cls);
    if (!css) {
      if (!unknown.has(cls)) {
        unknown.add(cls);
        warnUnknownClass(cls, parseClass(cls).baseClass);
      }
      return;
    }
    ensureStyleTag().appendChild(document.createTextNode(css + "\n"));
    injected.add(cls);
  }

  function scanElement(el) {
    if (el.classList) el.classList.forEach(injectRule);
  }

  function scanTree(root) {
    scanElement(root);
    if (root.querySelectorAll) root.querySelectorAll("*").forEach(scanElement);
  }

  // =========================================================
  // 2b. DESIGN TOKEN BRIDGE
  //     Exposes color / spacing / radius RULES values as CSS custom
  //     properties (e.g. --artapa-bg-color-blue-500) on <html>, so raw
  //     CSS (outside ARTAPA classes) can reuse the exact same values —
  //     and stays in sync automatically if a value changes in RULES.
  //     Keep tokenEligible()/extractTokenValue() in sync with build.js,
  //     which duplicates this same logic for the static CSS build.
  // =========================================================
  function tokenEligible(key) {
    const [ns, sub = ""] = key.split(":");
    if (ns === "bg" && sub.startsWith("color")) return true;
    if (ns === "text" && sub.startsWith("color")) return true;
    if (ns === "border" && (sub.startsWith("color") || sub.startsWith("radius"))) return true;
    if (ns === "padding" || ns === "margin" || ns === "gap") return true;
    return false;
  }

  function extractTokenValue(decl) {
    const hexMatch = decl.match(/#[0-9a-fA-F]{3,8}/);
    if (hexMatch) return hexMatch[0];
    const valueMatch = decl.match(/:\s*([^;]+);/);
    return valueMatch ? valueMatch[1].trim() : null;
  }

  function applyDesignTokens() {
    if (typeof document === "undefined" || !document.documentElement) return;
    const root = document.documentElement;
    for (const key of Object.keys(RULES)) {
      if (!tokenEligible(key)) continue;
      const value = extractTokenValue(RULES[key]);
      if (!value) continue;
      root.style.setProperty(`--artapa-${key.replace(/:/g, "-")}`, value);
    }
  }

  // =========================================================
  // 3. PUBLIC API — window.ARTAPA
  // =========================================================
  const ARTAPA = {
    version: "0.1.0-beta.1",
    rules: RULES,
    breakpoints: BREAKPOINTS,
    states: STATES,

    // Add new rules at runtime (for plugins or theme extensions)
    extend(customRules) {
      Object.assign(RULES, customRules);
    },

    // Add or override a breakpoint at runtime, e.g. ARTAPA.setBreakpoint("xs", 480)
    setBreakpoint(name, minWidthPx) {
      BREAKPOINTS[name] = minWidthPx;
    },

    // Add or override a state/pseudo-class, e.g. ARTAPA.setState("disabled", ":disabled")
    setState(name, pseudoSelector) {
      STATES[name] = pseudoSelector;
    },

    // Configure dark mode strategy at runtime.
    // ARTAPA.setDarkMode({ strategy: "media" })                 -> follow OS color scheme
    // ARTAPA.setDarkMode({ strategy: "class", selector: ".x" }) -> custom toggle class
    setDarkMode(options) {
      if (options.strategy) DARK.strategy = options.strategy;
      if (options.selector) DARK.selector = options.selector;
    },
    dark: DARK,

    // Re-applies all color/spacing/radius RULES values as CSS custom
    // properties on <html> (e.g. --artapa-bg-color-blue-500). Runs
    // automatically on init(); call again after extend() if you added
    // new color/spacing/radius rules and want them exposed as tokens too.
    applyDesignTokens,

    // Reads a single token's current value, e.g. ARTAPA.getToken("bg:color-blue-500") -> "#3b82f6"
    getToken(key) {
      if (typeof document === "undefined") return null;
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`--artapa-${key.replace(/:/g, "-")}`)
        .trim() || null;
    },

    // Manually scan a specific subtree
    scan(root) {
      scanTree(root || document.body);
    },

    // Starts the engine — observes the DOM and auto-detects new elements/classes
    init(root) {
      const target = root || document.body;
      applyDesignTokens();
      scanTree(target);
      if (observer) observer.disconnect();
      observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === "childList") {
            m.addedNodes.forEach((node) => {
              if (node.nodeType === 1) scanTree(node);
            });
          } else if (m.type === "attributes" && m.attributeName === "class") {
            scanElement(m.target);
          }
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      });
      return observer;
    },

    stop() {
      if (observer) observer.disconnect();
    },

    // Returns the CSS generated so far, as text (useful for debugging/export)
    getGeneratedCSS() {
      return ensureStyleTag().textContent;
    },

    getUnknownClasses() {
      return Array.from(unknown);
    },

    // Internal — exposed for the Node.js purge tool (purge.js) so it can
    // reuse the exact same class-parsing and CSS-generation logic as the
    // browser runtime. Not a stable public API; may change between versions.
    _internal: {
      RULES,
      BREAKPOINTS,
      STATES,
      DARK,
      parseClass,
      tryDynamicRule,
      buildRuleCSS,
      tokenEligible,
      extractTokenValue,
    },
  };

  global.ARTAPA = ARTAPA;

  // Auto-init: starts as soon as the DOM is ready, unless the script tag
  // has data-auto="false".
  function autoInit() {
    const scriptTag = document.currentScript || document.querySelector('script[src*="core"]');
    if (scriptTag && scriptTag.dataset && scriptTag.dataset.auto === "false") return;
    ARTAPA.init(document.body);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
})(window);
