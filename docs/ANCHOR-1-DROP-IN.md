# Anchor #1 copy: where each section lives

The canonical copy is `content/anchor-1/anchor-1-guide.md` (CPO). The site renders it from
`lib/guides/content.ts`, structured per anchor-brief section 4 and validated by
`lib/guides/validate.ts` (R7: a missing or malformed block fails the build and the page).
Prose fields allow `**bold**` and `[label](https://...)` links only (`components/guide/RichText.tsx`).

| Brief section | Field(s) | Rendered as |
| --- | --- | --- |
| Intro / illustration-only note | `title`, `summary`, `illustrationNote` | h1, lead, `demo-disclaimer` block (mandatory) |
| 1. Why AI summaries go wrong | `whyAiGoesWrong { intro[], mistakes[{term,text}], outro[] }` | paragraphs + bulleted list |
| 2. Prompt used, verbatim | `promptIntro`, `prompt`, `promptNotes[]` | `<pre><code>` (exact text) + notes |
| 3. 5-claim check | `claimCheckIntro[]`, `claimChecks[5] {claim, verdict, where[{label,url}], whatTheSourceSays}`, `howToCheck[{step,text}]`, `claimCheckNotes[]` | table (verdict is `Supported`/`Unsupported`/`Not found`; page links), numbered steps, notes with inline page links |
| 4. How this fails | `howThisFails { intro[], prompt, answerIntro, aiAnswer[], findings[{finding,check,where[]}], outro[] }` | `<pre><code>` prompt, verbatim answer list, findings table with page links |
| 5. What still needs a human | `needsAHuman[]` | paragraphs |
| 6. Checklist opt-in | `optIn { heading, body[], consent }`, `defaultCampaign: 'cmp-anchor-1'` | heading + copy + Kit form (campaign tag `cmp-anchor-1` unless a listed `utm_campaign` is present) |
| 7. Sources, last tested | `sources[{title, link}]`, `lastTestedOn`, `lastTestedNote` | list; "Last tested on <date>." followed by the note |
| 8. Tools used | `toolsPricesIntro`, `toolsPrices[{name, aud, checkedOn, source?}]`, `toolsNotes[]` | list with A$ prices |

`placeholderNotice` (optional) shows a visible banner; the final copy omits it. The global
footer carries the general-information disclosure and "Not affiliated with xAI".
After editing run `npm run lint`, `npm run type-check`, `npx vitest run`, `npm run build`
and `npm run check:commercial`.
