#!/usr/bin/env node
import { createHttpKitApi } from '../lib/attribution/kit-client.mjs';
import { tagSources } from '../lib/attribution/tag-sources.mjs';

const apiKey = process.env.KIT_API_KEY;
const formId = process.env.KIT_FORM_ID;
if (!apiKey || !formId || !/^[1-9]\d*$/.test(formId)) {
  console.error('KIT_API_KEY and a positive integer KIT_FORM_ID are required.');
  process.exitCode = 2;
} else if (process.argv.slice(2).some(arg => !['--dry-run', '--apply'].includes(arg))) {
  console.error('Usage: node scripts/kit-tag-sources.mjs [--dry-run | --apply]');
  process.exitCode = 2;
} else {
  try {
    const summary = await tagSources({
      api: createHttpKitApi({ apiKey }), formId,
      dryRun: !process.argv.includes('--apply') || process.argv.includes('--dry-run'),
      log: line => console.error(line),
    });
    console.log(JSON.stringify(summary, null, 2));
  } catch {
    console.error('Tagging failed. Check provider access and response structure; sensitive details omitted.');
    process.exitCode = 1;
  }
}
