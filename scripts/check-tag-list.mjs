#!/usr/bin/env node
/**
 * Validates the committed attribution tag list. Runs before every build.
 * When the build uses the Kit hosted form (NEXT_PUBLIC_EMAIL_PROVIDER=kit), every
 * listed tag must have its Kit tag ID, otherwise signups could not carry their
 * src-* tag and the build fails.
 */
import { tagListProblems } from '../lib/attribution/source-tags.mjs';

const requireIds = process.env.NEXT_PUBLIC_EMAIL_PROVIDER === 'kit';
const problems = tagListProblems(undefined, { requireIds });
if (problems.length) {
  console.error(`check-tag-list: ${problems.length} problem(s)${requireIds ? ' (Kit provider: IDs required)' : ''}`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exitCode = 1;
} else {
  console.log(`check-tag-list: ok${requireIds ? ' (Kit provider, all tag IDs present)' : ' (mock provider, IDs not required)'}`);
}
