# Anchor #1 copy drop-in contract

Paste the CPO copy into the preview entry in `lib/guides/content.ts`. Copy is due
Sat 24 Oct 2026 12:00. The field names below match `Guide` and R7 validation.
Keep the placeholder notice, noindex and `[Placeholder]` title while this remains
a preview. No real error or price verification is claimed by the example content.

| Brief section | Exact fields | Contract |
| --- | --- | --- |
| 1. Why AI summaries go wrong | `whyAiGoesWrong: string[]` | Nonempty paragraphs. |
| 2. Prompt used verbatim | `prompt: string` | Exact nonempty prompt including whitespace; rendered in `<pre>`. |
| 3. Five-claim check table | `claimChecks: { claim, whatTheSourceSays, verdict, sourceUrl, sourceLocator }[]` | Exactly five rows. Nonempty text; verdict is `supported`, `not-supported` or `partly`. HTTP(S) link to exact source page/line, with locator such as `p. 3, line 12`. |
| 4. How this fails | `howThisFails: { aiSaid, sourceSays, sourceUrl }` | One real caught error, exact AI statement, source evidence and HTTP(S) source link. Replace the illustrative error. |
| 5. What still needs a human | `needsAHuman: string[]` | Nonempty paragraphs. |
| 6. Checklist opt-in | `optIn: { heading }`; `defaultCampaign: 'cmp-anchor-1'` | Nonempty opt-in heading. Use the shared guide campaign map in `source-tags.mjs`; an optional listed `cmp-*` key. A listed URL campaign wins. The opt-in itself is supplied by the template; no delivery link in copy. |
| 7. Sources, last tested, tools/prices | `sources: { title, url }[]`; `lastTestedOn: string`; `toolsPrices: { name, aud, checkedOn, source }[]` | Nonempty source/tool lists. HTTP(S) URLs. Dates are real `YYYY-MM-DD` values. `aud` is a finite nonnegative number rendered as `A$12.00`; `checkedOn` belongs to each tool's price source. |

Also supply `title`, `summary`, and preserve the route `slug` of
`preview-ai-research-checklist`. `demoDisclaimer: true` is mandatory.
`placeholderNotice` is the visible banner; keep it for this placeholder round.
The layout provides global disclosures. All current `[Placeholder]` paragraphs,
example.com links, dates and illustrative numbers must be replaced with checked
editorial evidence before publication. Keep the content free of commercial paths,
referral parameters and stock views. Run `npm run type-check`, `npx vitest run`,
`npm run build` and `npm run check:commercial` after pasting copy.
