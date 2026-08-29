#!/usr/bin/env node

/**
 * Robots.txt Generator Script
 *
 * Generates a robots.txt file for the site with sensible defaults:
 *   - Allows all user-agents
 *   - References the sitemap
 *   - Disallows non-content directories
 *
 * Usage:  node generate-robots.js
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────────────────

const SITE_URL = 'https://rubulhoquechoudhury.github.io';
const OUTPUT_FILE = path.join(__dirname, 'robots.txt');

// Paths to disallow (directories that should not be crawled)
const DISALLOWED_PATHS = [
  '/.git/',
  '/.github/',
];

// Additional user-agent rules (beyond the default allow-all)
// Format: { userAgent: string, disallow: string[] }
const ADDITIONAL_RULES = [];

// ─── Generator ───────────────────────────────────────────────────────────────

function buildRobotsTxt() {
  const lines = [];

  // Default rule: allow all
  lines.push('User-agent: *');

  for (const disallowed of DISALLOWED_PATHS) {
    lines.push(`Disallow: ${disallowed}`);
  }

  lines.push('');

  // Additional user-agent rules
  for (const rule of ADDITIONAL_RULES) {
    lines.push(`User-agent: ${rule.userAgent}`);
    for (const disallowed of rule.disallow) {
      lines.push(`Disallow: ${disallowed}`);
    }
    lines.push('');
  }

  // Sitemap reference
  lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push(''); // trailing newline

  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('🤖 Generating robots.txt...\n');

  const content = buildRobotsTxt();

  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');

  console.log('Generated robots.txt content:\n');
  console.log(content);
  console.log(`✅ robots.txt written to ${OUTPUT_FILE}`);
}

main();
