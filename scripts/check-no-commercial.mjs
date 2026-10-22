#!/usr/bin/env node
/**
 * Fails if referral, sponsored, Binance, Polymarket or affiliate content, or the
 * old investlink.com domain, is present in the site source or in the built
 * output. Lines are also checked after HTML-entity, JS-escape and URL decoding.
 *
 *   node scripts/check-no-commercial.mjs            # source only
 *   node scripts/check-no-commercial.mjs --build    # source + .next build output
 *
 * "affiliated" (as in the required "Not affiliated with xAI" disclosure) is
 * allowed; "affiliate", "Affiliate", "affiliates" are not.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RULES = [
  { id: 'old-domain', re: /investlink\.com/i },
  { id: 'referral-param', re: /[?&;](ref|referral|aff|affid|aff_id|partner|partner_id|via|tag|irclickid)=/i },
  { id: 'feynmanxu-ref', re: /ref=feynmanxu/i },
  { id: 'sponsored', re: /\bsponsored\b/i },
  { id: 'binance', re: /binance/i },
  { id: 'polymarket', re: /polymarket/i },
  { id: 'affiliate', re: /affiliate(?!d)/i },
  { id: 'go-redirect', re: /["'`(]\/go\//i },
];

const SOURCE_ROOTS = ['app', 'components', 'lib', 'public', 'middleware.ts', 'next.config.mjs', '.env.example'];
const SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.jsx', '.json', '.svg', '.css', '.html', '.htm', '.webmanifest', '.txt', '.xml', '.md', '.example', '']);
const BUILD_ROOTS = ['.next/server/app', '.next/static'];
const BUILD_EXT = new Set(['.html', '.htm', '.webmanifest', '.js', '.rsc', '.body', '.json', '.css', '.txt', '.xml']);

function walk(path, out) {
  if (!existsSync(path)) return out;
  const st = statSync(path);
  if (st.isFile()) {
    out.push(path);
    return out;
  }
  for (const name of readdirSync(path)) walk(join(path, name), out);
  return out;
}

const NAMED_ENTITIES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', sol: '/', quest: '?', equals: '=', period: '.', colon: ':' };

/**
 * Decode the encodings a link can hide behind in source or build output:
 * HTML entities (&amp; &#38; &#x26;), JS/JSON escapes (\u0026, \x26) and URL
 * percent-encoding (%3Fref%3D). Applied twice to catch double encoding.
 */
export function decodeLine(line) {
  let out = line;
  for (let pass = 0; pass < 2; pass++) {
    out = out
      .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(Number(d)))
      .replace(/&([a-z]+);/gi, (m, n) => NAMED_ENTITIES[n.toLowerCase()] ?? m)
      .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/%([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  }
  return out;
}

export function scanText(text) {
  const hits = [];
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const decoded = decodeLine(line);
    for (const rule of RULES) {
      const m = line.match(rule.re) ?? (decoded === line ? null : decoded.match(rule.re));
      if (m) hits.push({ rule: rule.id, line: i + 1, match: m[0] });
    }
  });
  return hits;
}

/**
 * Next.js embeds the absolute checkout path in build output (e.g. route-loader
 * filePath=...). The repo is named affiliate_flywheel_web, so CI checkouts
 * (/home/runner/work/affiliate_flywheel_web/...) would trip the affiliate rule
 * on a path, not on content. Mask the checkout path, raw and URL-encoded.
 */
export function maskRoot(text, root) {
  if (!root) return text;
  let out = text;
  for (const form of new Set([root, encodeURIComponent(root), encodeURIComponent(root).toLowerCase()])) {
    out = out.split(form).join('<root>');
  }
  return out;
}

export function scan(root, { build = false } = {}) {
  const findings = [];
  const files = [];
  for (const r of SOURCE_ROOTS) {
    for (const f of walk(join(root, r), [])) if (SOURCE_EXT.has(extname(f))) files.push(f);
  }
  if (build) {
    const before = files.length;
    for (const r of BUILD_ROOTS) {
      for (const f of walk(join(root, r), [])) if (BUILD_EXT.has(extname(f))) files.push(f);
    }
    if (files.length === before) throw new Error('no build output under .next; run `npm run build` first');
  }
  for (const f of files) {
    for (const h of scanText(maskRoot(readFileSync(f, 'utf8'), root))) findings.push({ file: relative(root, f), ...h });
  }
  return { files: files.length, findings };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = process.cwd();
  const build = process.argv.includes('--build');
  try {
    const { files, findings } = scan(root, { build });
    for (const f of findings) console.error(`${f.file}:${f.line}: ${f.rule}: ${f.match}`);
    console.log(`check-no-commercial: scanned ${files} files${build ? ' (source + build)' : ' (source)'}, ${findings.length} finding(s)`);
    process.exit(findings.length ? 1 : 0);
  } catch (e) {
    console.error(`check-no-commercial: ${e.message}`);
    process.exit(2);
  }
}
