#!/usr/bin/env node
/*!
 * ARTAPA CSS — purge.js
 * Production build tool: scans your actual project files for ARTAPA
 * classes in use, then generates a single minimal CSS file containing
 * ONLY those classes — instead of shipping every possible class/variant
 * like dist/artapa.css does.
 *
 * This reuses the exact same class-parsing and rule-generation logic as
 * the browser runtime (src/core.js's buildRuleCSS, via ARTAPA._internal),
 * so purge output can never drift from what the runtime would generate.
 *
 * Usage:
 *   node purge.js [globs...] [--out dist/artapa.purged.css] [--ext .html,.js,.jsx,.tsx,.vue]
 *
 * Examples:
 *   node purge.js                          # scans the current directory
 *   node purge.js ./src ./public           # scans specific folders
 *   node purge.js --out build/styles.css   # custom output path
 */
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------
// 1. Load the ARTAPA engine in a minimal Node-compatible shim, so we can
//    reuse its real parsing/CSS-generation logic instead of re-implementing
//    it a third time (already duplicated once in build.js for tokens).
// ---------------------------------------------------------------------
function loadArtapaEngine() {
  const coreSrc = fs.readFileSync(path.join(__dirname, "src/core.js"), "utf8");
  const sandbox = { window: {} };
  sandbox.MutationObserver = class {
    observe() {}
    disconnect() {}
  };
  sandbox.document = {
    readyState: "complete",
    currentScript: null,
    querySelector: () => null,
    getElementById: () => null,
    head: { appendChild: () => {} },
    body: { classList: null, querySelectorAll: () => [] },
    documentElement: { style: { setProperty: () => {} } },
    addEventListener: () => {},
    createTextNode: (t) => ({ textContent: t }),
  };
  sandbox.getComputedStyle = () => ({ getPropertyValue: () => "" });

  const fn = new Function(
    "window",
    "document",
    "MutationObserver",
    "getComputedStyle",
    coreSrc + "\nreturn window.ARTAPA;"
  );
  return fn(sandbox.window, sandbox.document, sandbox.MutationObserver, sandbox.getComputedStyle);
}

// ---------------------------------------------------------------------
// 2. CLI argument parsing
// ---------------------------------------------------------------------
function parseArgs(argv) {
  const args = { globs: [], out: "dist/artapa.purged.css", extensions: [".html", ".htm", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".php"] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") {
      args.out = argv[++i];
    } else if (a === "--ext") {
      args.extensions = argv[++i].split(",").map((e) => (e.startsWith(".") ? e : "." + e));
    } else {
      args.globs.push(a);
    }
  }
  if (args.globs.length === 0) args.globs.push(".");
  return args;
}

// ---------------------------------------------------------------------
// 3. File discovery — recursively walk each given path, skipping the
//    usual noise directories, and collect files matching the extensions.
// ---------------------------------------------------------------------
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".next", ".nuxt", "build", "out", ".cache"]);

function walk(dir, extensions, results) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // not a directory / unreadable, skip
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full, extensions, results);
    } else if (extensions.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
}

function collectFiles(globs, extensions) {
  const results = [];
  for (const g of globs) {
    const stat = fs.existsSync(g) ? fs.statSync(g) : null;
    if (stat && stat.isFile()) {
      results.push(g);
    } else if (stat && stat.isDirectory()) {
      walk(g, extensions, results);
    }
  }
  return results;
}

// ---------------------------------------------------------------------
// 4. Class extraction — pulls candidate class tokens out of
//    class="..." / className="..." attributes, and also picks up
//    var(--artapa-...) references so directly-used design tokens
//    aren't dropped even if their class was never written.
// ---------------------------------------------------------------------
const CLASS_ATTR_REGEX = /class(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g;
const VAR_TOKEN_REGEX = /var\(\s*--artapa-([a-zA-Z0-9-]+)\s*\)/g;

function extractFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const classes = new Set();
  const tokenRefs = new Set();

  let m;
  while ((m = CLASS_ATTR_REGEX.exec(content))) {
    for (const token of m[1].split(/\s+/)) {
      if (token) classes.add(token);
    }
  }
  while ((m = VAR_TOKEN_REGEX.exec(content))) {
    tokenRefs.add(m[1]); // e.g. "bg-color-blue-500"
  }
  return { classes, tokenRefs };
}

// ---------------------------------------------------------------------
// 5. Main
// ---------------------------------------------------------------------
function main(argv) {
  const args = parseArgs(argv || process.argv.slice(2));
  const ARTAPA = loadArtapaEngine();
  const { buildRuleCSS, RULES, tokenEligible, extractTokenValue } = ARTAPA._internal;

  const files = collectFiles(args.globs, args.extensions);
  if (files.length === 0) {
    console.warn(`⚠ No files found matching extensions [${args.extensions.join(", ")}] in: ${args.globs.join(", ")}`);
  }

  const allClasses = new Set();
  const allTokenRefs = new Set(); // explicit var(--artapa-X) references
  for (const file of files) {
    const { classes, tokenRefs } = extractFromFile(file);
    classes.forEach((c) => allClasses.add(c));
    tokenRefs.forEach((t) => allTokenRefs.add(t));
  }

  // Resolve each candidate class through the real engine logic.
  const usedRuleCSS = [];
  const recognizedClasses = [];
  const unrecognizedClasses = [];
  const neededTokenKeys = new Set(); // RULES keys (e.g. "bg:color-blue-500") to expose as tokens

  for (const cls of allClasses) {
    const css = buildRuleCSS(cls);
    if (css) {
      usedRuleCSS.push(css);
      recognizedClasses.push(cls);
    } else {
      unrecognizedClasses.push(cls);
    }
  }

  // Figure out which RULES keys are in play (for token inclusion), by
  // re-parsing each recognized class the same way core.js does.
  for (const cls of recognizedClasses) {
    const { baseClass } = ARTAPA._internal.parseClass(cls);
    if (tokenEligible(baseClass)) neededTokenKeys.add(baseClass);
  }
  // Also honor explicit var(--artapa-X) usage even without a matching class.
  for (const key of Object.keys(RULES)) {
    const tokenName = key.replace(/:/g, "-");
    if (allTokenRefs.has(tokenName)) neededTokenKeys.add(key);
  }

  // Build the output CSS.
  let out = `/*!\n * ARTAPA CSS — purged production build\n * Generated by purge.js from ${files.length} scanned file(s).\n * Contains ONLY the classes/tokens actually found in your project.\n */\n\n`;

  if (neededTokenKeys.size > 0) {
    out += `:root{\n`;
    for (const key of neededTokenKeys) {
      const value = extractTokenValue(RULES[key]);
      if (value) out += `  --artapa-${key.replace(/:/g, "-")}: ${value};\n`;
    }
    out += `}\n\n`;
  }

  out += usedRuleCSS.sort().join("\n") + "\n";

  const outDir = path.dirname(args.out);
  if (outDir && !fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(args.out, out);

  const minified = out
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*\{\s*/g, "{")
    .replace(/\s*\}\s*/g, "}")
    .replace(/;\s+/g, ";")
    .trim();
  const minPath = args.out.replace(/\.css$/, ".min.css");
  fs.writeFileSync(minPath, minified);

  // ---- Report ----
  console.log(`\n📦 ARTAPA CSS purge report`);
  console.log(`   Files scanned:          ${files.length}`);
  console.log(`   Distinct classes found: ${allClasses.size}`);
  console.log(`   Recognized (kept):      ${recognizedClasses.length}`);
  console.log(`   Unrecognized (skipped): ${unrecognizedClasses.length}`);
  console.log(`   Design tokens included: ${neededTokenKeys.size}`);
  console.log(`   Output:                 ${args.out}  (${out.length} bytes)`);
  console.log(`   Output (minified):      ${minPath}  (${minified.length} bytes)`);

  if (unrecognizedClasses.length > 0) {
    console.log(`\n⚠ Unrecognized classes (typos, non-ARTAPA classes, or hallucinated names) — not included in output:`);
    for (const c of unrecognizedClasses.sort()) console.log(`   - ${c}`);
  }

  console.log(`\nNext step: replace the runtime <script src=".../core.min.js"> tag with:`);
  console.log(`   <link rel="stylesheet" href="${path.basename(minPath)}">\n`);
}

module.exports = { run: main };

if (require.main === module) {
  main();
}
