#!/usr/bin/env node
/**
 * Validates the committed attribution tag list. Runs before every build.
 * When the build uses the Kit hosted form (NEXT_PUBLIC_EMAIL_PROVIDER=kit), hidden-tags requires listed tag IDs; form-per-source requires a complete,
 * distinct source form map. Unknown modes fail. No network is used.
 */
import { attributionProblems } from '../lib/attribution/source-tags.mjs';

const requireIds = process.env.NEXT_PUBLIC_EMAIL_PROVIDER === 'kit';
const problems = attributionProblems(process.env);
if (problems.length) {
  console.error(`check-tag-list: ${problems.length} problem(s)${requireIds ? ' (Kit provider: IDs required)' : ''}`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log(`check-tag-list: ok${requireIds ? ' (Kit provider, attribution configuration valid)' : ' (mock provider, IDs not required)'}`);
}
