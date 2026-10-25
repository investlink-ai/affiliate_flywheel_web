#!/usr/bin/env node
/**
 * Read-only attribution report (R1/R3). Reads a Kit form's subscribers and their
 * tags and checks the tag rules in lib/attribution/tag-list.mjs. It never creates
 * or applies tags: tags are set at subscribe time by the hosted form.
 *
 * Env (operator only, never public): KIT_API_KEY, KIT_FORM_ID.
 * Output: JSON report on stdout (subscriber IDs only, no email addresses).
 * Exit: 0 ok, 1 rule violations, 2 usage/config error, 3 provider/read failure.
 */
import { createHttpKitApi } from '../lib/attribution/kit-client.mjs';
import { attributionMode, sourceFormProblems } from '../lib/attribution/source-tags.mjs';
import { tagReport } from '../lib/attribution/tag-report.mjs';

const apiKey = process.env.KIT_API_KEY;
const formId = process.env.KIT_FORM_ID;
const mode = attributionMode(process.env.NEXT_PUBLIC_KIT_ATTRIBUTION);
if (process.argv.length > 2) {
  console.error('Usage: node scripts/kit-tag-report.mjs   (read-only; takes no arguments)');
  process.exitCode = 2;
} else if (!apiKey || !mode || (mode === 'hidden-tags' ? (!formId || !/^[1-9]\d*$/.test(formId)) : sourceFormProblems(undefined, { requireIds: true }).length > 0)) {
  console.error('KIT_API_KEY and valid attribution configuration are required (KIT_FORM_ID for hidden-tags; committed sourceForms for form-per-source).');
  process.exitCode = 2;
} else {
  try {
    const report = await tagReport({ api: createHttpKitApi({ apiKey }), formId, mode });
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.ok ? 0 : 1;
  } catch {
    console.error('Report failed. Check provider access and response structure; sensitive details omitted.');
    process.exitCode = 3;
  }
}
