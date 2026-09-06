#!/usr/bin/env node
/*!
 * ARTAPA CSS CLI
 * Usage:
 *   artapa build [globs...] [--out dist/artapa.purged.css] [--ext .html,.js,.jsx]
 *   artapa --help
 *
 * `artapa build` scans your real project files for ARTAPA classes in use
 * and generates a minimal production CSS file — see purge.js for the
 * implementation (also usable directly: `node purge.js ...`).
 */
const path = require("path");

function printHelp() {
  console.log(`
ARTAPA CSS CLI

Usage:
  artapa build [globs...] [options]     Scan your project and generate a minimal production CSS file
  artapa --help, -h                     Show this help

Options (for "build"):
  --out <path>     Output CSS path (default: dist/artapa.purged.css)
  --ext <list>     Comma-separated file extensions to scan
                    (default: .html,.htm,.js,.jsx,.ts,.tsx,.vue,.svelte,.php)

Examples:
  artapa build
  artapa build ./src ./public
  artapa build ./src --out dist/styles.css --ext .html,.jsx
`);
}

function main() {
  const argv = process.argv.slice(2);
  const subcommand = argv[0];

  if (subcommand === "build") {
    const purge = require(path.join(__dirname, "..", "purge.js"));
    purge.run(argv.slice(1));
    return;
  }

  if (!subcommand || subcommand === "--help" || subcommand === "-h") {
    printHelp();
    return;
  }

  console.error(`Unknown command: "${subcommand}"\n`);
  printHelp();
  process.exitCode = 1;
}

main();
