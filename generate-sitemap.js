#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * 
 * Automatically scans the project directory for .html files and generates
 * an up-to-date sitemap.xml with proper lastmod timestamps.
 * 
 * Usage:  node generate-sitemap.js
 * 
 * Configuration: Edit the constants below to customize behavior.
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────────────────

const SITE_URL = 'https://rubulhoquechoudhury.github.io';
const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(ROOT_DIR, 'sitemap.xml');

// Files and directories to exclude from the sitemap
const EXCLUDED_FILES = [
  'google6e71e5fbe76b0409.html', // Google verification page
  '404.html',                     // Error page
];

const EXCLUDED_DIRS = [
  '.git',
  'node_modules',
  '.github',
  '.vscode',
];

// Priority mapping (filename → priority value)
const PRIORITY_MAP = {
  'index.html': '1.0',
};

// Default priority for pages not in the map
const DEFAULT_PRIORITY = '0.8';

// Change frequency mapping (filename → changefreq)
const CHANGEFREQ_MAP = {
  'index.html': 'weekly',
};

const DEFAULT_CHANGEFREQ = 'monthly';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Recursively find all .html files in a directory, respecting exclusions.
 */
function findHtmlFiles(dir, baseDir = dir) {
  let results = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        results = results.concat(findHtmlFiles(fullPath, baseDir));
      }
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.html') &&
      !EXCLUDED_FILES.includes(entry.name)
    ) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);

      results.push({
        file: entry.name,
        relativePath,
        lastModified: stat.mtime,
      });
    }
  }

  return results;
}

/**
 * Convert a file's relative path to a sitemap URL.
 *   index.html        → https://example.com/
 *   projects.html      → https://example.com/projects.html
 *   sub/page.html      → https://example.com/sub/page.html
 */
function toUrl(relativePath) {
  if (relativePath === 'index.html') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}/${relativePath}`;
}

/**
 * Format a Date as an ISO 8601 date-time string with timezone offset.
 */
function formatDate(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

/**
 * Build the XML sitemap string from a list of page entries.
 */
function buildSitemapXml(pages) {
  const urlEntries = pages
    .map((page) => {
      const loc = toUrl(page.relativePath);
      const lastmod = formatDate(page.lastModified);
      const priority = PRIORITY_MAP[page.file] || DEFAULT_PRIORITY;
      const changefreq = CHANGEFREQ_MAP[page.file] || DEFAULT_CHANGEFREQ;

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '', // trailing newline
  ].join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('🔍 Scanning for HTML files...\n');

  const pages = findHtmlFiles(ROOT_DIR);

  // Sort: index.html first, then alphabetically
  pages.sort((a, b) => {
    if (a.file === 'index.html') return -1;
    if (b.file === 'index.html') return 1;
    return a.relativePath.localeCompare(b.relativePath);
  });

  if (pages.length === 0) {
    console.log('⚠️  No HTML files found. Sitemap not generated.');
    process.exit(1);
  }

  console.log(`📄 Found ${pages.length} page(s):\n`);
  for (const page of pages) {
    console.log(`   ${toUrl(page.relativePath)}`);
  }

  const xml = buildSitemapXml(pages);
  fs.writeFileSync(OUTPUT_FILE, xml, 'utf-8');

  console.log(`\n✅ Sitemap written to ${OUTPUT_FILE}`);
}

main();
