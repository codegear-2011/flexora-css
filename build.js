/*!
 * ARTAPA CSS — build.js
 * Generates dist/artapa.css and dist/artapa.min.css directly from the
 * RULES dictionary inside src/core.js. Single source of truth — the JS
 * runtime engine and the static CSS build can never fall out of sync.
 *
 * Usage: node build.js
 */
const fs = require("fs");
const path = require("path");

// Extract RULES, BREAKPOINTS, and STATES from core.js (sandboxed eval, build-time only)
const coreSrc = fs.readFileSync(path.join(__dirname, "src/core.js"), "utf8");

const rulesMatch = coreSrc.match(/const RULES = (\{[\s\S]*?\n  \});/);
if (!rulesMatch) throw new Error("Could not parse the RULES dictionary out of core.js.");
const RULES = eval("(" + rulesMatch[1] + ")");

const bpMatch = coreSrc.match(/const BREAKPOINTS = (\{[\s\S]*?\n  \});/);
if (!bpMatch) throw new Error("Could not parse the BREAKPOINTS object out of core.js.");
const BREAKPOINTS = eval("(" + bpMatch[1] + ")");

const stateMatch = coreSrc.match(/const STATES = (\{[\s\S]*?\n  \});/);
if (!stateMatch) throw new Error("Could not parse the STATES object out of core.js.");
const STATES = eval("(" + stateMatch[1] + ")");

const darkSelectorMatch = coreSrc.match(/const DARK_SELECTOR_DEFAULT = ("[^"]*");/);
if (!darkSelectorMatch) throw new Error("Could not parse DARK_SELECTOR_DEFAULT out of core.js.");
const DARK_SELECTOR = eval(darkSelectorMatch[1]);

function cssEscape(cls) {
  return "." + cls.replace(/[:]/g, "\\$&");
}

// ---- Design token eligibility + value extraction ----
// IMPORTANT: keep this in sync with tokenEligible()/extractTokenValue()
// in src/core.js — the JS runtime does the equivalent thing at runtime
// via CSS custom properties on <html>, this does it once at build time
// as a plain :root{} block for the static CSS build.
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

// Group classes by namespace so the output file reads cleanly
const groups = {};
for (const cls of Object.keys(RULES)) {
  const ns = cls.split(":")[0];
  (groups[ns] = groups[ns] || []).push(cls);
}

let out = `/*!
 * ARTAPA CSS v0.1.0 — Static Build
 * Auto-generated from the RULES dictionary in src/core.js. Do not edit by hand.
 * Usage: <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<user>/artapa-css@v0.1.0/dist/artapa.css">
 */\n\n`;

for (const ns of Object.keys(groups)) {
  out += `/* ---- ${ns} ---- */\n`;
  for (const cls of groups[ns]) {
    out += `${cssEscape(cls)} { ${RULES[cls]} }\n`;
  }
  out += "\n";
}

// ---- Design Token Bridge ----
// Exposes color/spacing/radius values as CSS custom properties on :root,
// so raw CSS outside ARTAPA classes can reuse the exact same values,
// e.g. background-color: var(--artapa-bg-color-blue-500);
let tokenCount = 0;
out += `/* ---- design tokens (CSS custom properties) ---- */\n:root{\n`;
for (const cls of Object.keys(RULES)) {
  if (!tokenEligible(cls)) continue;
  const value = extractTokenValue(RULES[cls]);
  if (!value) continue;
  out += `  --artapa-${cls.replace(/:/g, "-")}: ${value};\n`;
  tokenCount++;
}
out += `}\n\n`;

// ---- Responsive breakpoint variants ----
// Every class gets a prefixed variant wrapped in a min-width media query
// for each breakpoint, so md:layout:flex, lg:font:size-xl etc. work in
// the static build too.
const bpNames = Object.keys(BREAKPOINTS).sort((a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]);
out += `/* ---- responsive breakpoints ---- */\n`;
for (const bp of bpNames) {
  out += `@media (min-width:${BREAKPOINTS[bp]}px){\n`;
  for (const cls of Object.keys(RULES)) {
    const prefixedClass = `${bp}:${cls}`;
    out += `  ${cssEscape(prefixedClass)} { ${RULES[cls]} }\n`;
  }
  out += `}\n\n`;
}

// ---- State variants (hover / focus / active) ----
// Breakpoint + state combinations (e.g. md:hover:...) are intentionally
// NOT generated in the static build — that would blow up file size.
// Use the JS runtime engine if you need combined prefixes.
out += `/* ---- state variants (hover/focus/active) ---- */\n`;
for (const st of Object.keys(STATES)) {
  for (const cls of Object.keys(RULES)) {
    const prefixedClass = `${st}:${cls}`;
    out += `${cssEscape(prefixedClass)}${STATES[st]} { ${RULES[cls]} }\n`;
  }
  out += "\n";
}

// ---- Dark mode variants ----
// Static build only ships the "class" strategy (toggle via a "dark"
// ancestor class, e.g. on <html> or <body>). The "media" strategy
// (prefers-color-scheme) and combinations with breakpoint/state are
// JS-runtime-only features — see ARTAPA.setDarkMode() in the docs.
out += `/* ---- dark mode (class strategy: add/remove "${DARK_SELECTOR}" on an ancestor, e.g. <html>) ---- */\n`;
for (const cls of Object.keys(RULES)) {
  const prefixedClass = `dark:${cls}`;
  out += `${DARK_SELECTOR} ${cssEscape(prefixedClass)} { ${RULES[cls]} }\n`;
}
out += "\n";

fs.writeFileSync(path.join(__dirname, "dist/artapa.css"), out);

// Basic minification (strip comments and collapse whitespace)
const minified = out
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*\{\s*/g, "{")
  .replace(/\s*\}\s*/g, "}")
  .replace(/;\s+/g, ";")
  .trim();
fs.writeFileSync(path.join(__dirname, "dist/artapa.min.css"), minified);

console.log(`✔ dist/artapa.css       (${out.length} bytes)`);
console.log(`✔ dist/artapa.min.css   (${minified.length} bytes)`);
console.log(`✔ Base classes: ${Object.keys(RULES).length}`);
console.log(`✔ Breakpoints: ${bpNames.join(", ")}`);
console.log(`✔ States: ${Object.keys(STATES).join(", ")}`);
console.log(`✔ Dark mode selector: ${DARK_SELECTOR}`);
console.log(`✔ Design tokens (CSS variables): ${tokenCount}`);
console.log(`✔ Total generated selectors: ${Object.keys(RULES).length * (bpNames.length + 1 + Object.keys(STATES).length + 1)}`);
