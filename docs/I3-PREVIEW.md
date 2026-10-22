# I3 preview path

Open `/guides/preview-ai-research-checklist?utm_source=x&utm_campaign=i3-preview`.
The path is guide → browser POST to Kit hosted form, carrying the page's
source/campaign tags → Kit double opt-in → incentive email with checklist.
A read-only report then checks the tags; nothing adds tags afterwards.
With no public provider configuration, the form is a local mock: it reports the
confirmation email that would be sent, without a network request or subscriber.

R11 is Kit configuration: enable the incentive email, require confirmation, and
configure "redirect to Download" with the checklist. Unconfirmed addresses must
never receive access to the checklist. The site does not deliver or host it.
Scope: every signup form on the site (preview guide, home, review pages, exit
popup) posts to the same Kit hosted form. `/api/newsletter` is retired on the
base branch (410 Gone, no Kit call), so no subscriber is ever created by API.

## Tag rules (R1/R3)

The committed list is `lib/attribution/tag-list.mjs`. Rules, each tested in
`__tests__/i3-attribution.test.mjs` and the form tests:

- Every signup gets exactly one `src-*` tag: `src-<utm_source>` when that value
  is in the list, otherwise `src-unattributed` (missing, unknown or malformed).
- At most one `cmp-*` tag: `cmp-<utm_campaign>` only when listed. No slugging;
  an unlisted campaign never becomes a tag.
- A signup with no `cmp-*` tag counts as `cmp-none` (report bucket, not a tag).
- Tags are lowercase kebab-case and come only from the committed list
  (`npm run check:tags`, also run before every build).
- Tags are set at subscribe time by the hosted form: the form sends one hidden
  `tags[]` field per tag, valued with the Kit tag ID, alongside `email_address`
  and `referrer`. Nothing adds or changes tags later.

The Kit tag IDs in the list are `null` until the tags are created in Kit (F5).
With `NEXT_PUBLIC_EMAIL_PROVIDER=kit` the build fails until every listed tag has
its ID, and a form that cannot resolve its IDs refuses to submit, so no signup
can leave without its `src-*` tag. Submit buttons stay disabled until the page
has hydrated and the hidden fields are filled.

**UNVERIFIED:** that Kit's hosted form endpoint applies `tags[]` IDs that are not
declared as tag checkboxes on the form, and whether it applies them at signup or
at confirmation. Kit's own HTML embeds use `name="tags[]"` with the tag ID for tag
checkboxes, which is the basis for this. If the R1/R3 preview test shows Kit
ignores undeclared IDs, the fallbacks, in order: (1) add a tag checkbox field
listing all src-/cmp- tags to the Kit form and hide it with the form's CSS, then
keep sending the same `tags[]` values; (2) one Kit form per source, each with its
own "add tag on subscribe" setting (spec §9.1 fallback). Both still set tags at
subscribe time.

## Environment variable names

- NEXT_PUBLIC_EMAIL_PROVIDER
- NEXT_PUBLIC_KIT_FORM_ID
- NEXT_PUBLIC_UMAMI_WEBSITE_ID
- KIT_API_KEY (operator only, for the read-only report)
- KIT_FORM_ID (operator only, for the read-only report)

Public variables are embedded at build time. The provider selects Kit only when
the provider selector is `kit` and its public form ID is a positive integer.
Keep KIT_API_KEY exclusively in the operator's environment, never in public
variables, browser code or the site's hosting env. Kit API keys are not
scoped, so the report enforces read-only in code: its client can only send GET. The offline form ID must match the public form ID.

## Read-only tag report

The old post-confirm tagging script (which applied `src-*`/`cmp-*` tags by API)
is gone: it conflicted with "tags are set at subscribe time, never added by
hand". `node scripts/kit-tag-report.mjs` (or `npm run report:tags`) replaces it.
It takes no arguments, reads every page of the form's subscribers and each
confirmed subscriber's tags, and never writes. It reports `confirmed`,
`unconfirmedSkipped`, `bySource`, `byCampaign` (with `cmp-none`), and
`violations` / `warnings` by subscriber ID only (no email addresses). Violations:
not exactly one `src-*`, more than one `cmp-*`, an unlisted src-/cmp- tag, tags
that differ from what the form sets for the UTMs Kit stored, or a tag applied
more than 24 h after signup (signs of a hand-added tag; `tagged_at` in the
response is UNVERIFIED). A mismatch when Kit stored no UTMs is only a warning.
Exit 0 ok, 1 violations, 2 usage/config, 3 read failure.

## Reviewer preview checks

1. R1: with the default mock, visit the guide and submit a valid test address.
   Verify the mock confirmation, required/email validation, privacy link, all six
   guide blocks, AUD prices, global disclosures and noindex metadata. No provider
   request should occur. Content, price sources and dates are explicitly preview
   placeholders pending CPO anchor #1 copy.
2. Configure the public Kit provider and form ID for a separate preview build.
   Configure Kit double opt-in and the R11 incentive settings above. Use only
   reviewer-owned test addresses. Inspect the form action and hidden `referrer`:
   it must include the full page URL, including UTM query parameters. Submit by
   browser POST, with no site API call or API-created subscriber.
3. R3: make three signups from guide URLs with `utm_source=x`, `youtube`, and
   `newsletter`, each with `utm_campaign=i3-preview`. Leave one additional signup
   unconfirmed; also confirm signups without UTM and with an unknown source.
   Before submitting, inspect the `tags[]` hidden fields (one src ID, one cmp
   ID). After confirming, check in Kit that each subscriber has distinct
   `src-x`, `src-youtube`, `src-newsletter`, plus `cmp-i3-preview`, and
   `src-unattributed` for the missing/unknown sources, with no tag added by
   anyone. Inspect Kit's stored `referrer_utm_parameters`. Run the read-only
   report: expect `ok: true`, the counts above, `cmp-none` for the no-campaign
   signups, and no email in the output. Note whether the unconfirmed signup
   already carries its tags (records the signup-vs-confirmation UNVERIFIED).
4. R11: before confirmation, verify no checklist download or checklist email is
   available. Follow the incentive email confirmation link and verify the Kit
   "redirect to Download" delivers the intended checklist. Verify unsubscribe.
5. With Umami configured, inspect script load/CSP and confirm `engaged_30s` fires
   after 30 seconds of visible time only. Hide the tab during the interval and
   verify hidden time is excluded. Check the Umami dashboard.

## Mocked and unverified

Unit tests use the in-memory Kit API and injected HTTP responses. No credentials
or live network are needed for tests. The preview copy, dates and prices are not
editorial research. Kit's interpretation of the explicit hidden `referrer` field
is UNVERIFIED until the R3 preview test, as is Kit applying the `tags[]` IDs; strict-origin-when-cross-origin otherwise
strips query strings from the HTTP Referer header. Live Kit payload shapes,
confirmation, incentive email/download configuration, unsubscribe, real
attribution persistence, and Umami Cloud collection need the manual checks above.
Cloudflare Pages deployment and its actual security headers are not verified;
no new server route, API handler or middleware is introduced by this preview.
