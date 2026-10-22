# I3 preview path

Open `/guides/preview-ai-research-checklist?utm_source=x&utm_campaign=i3-preview`.
The path is guide → browser POST to Kit hosted form, carrying the page's
source/campaign tags → Kit double opt-in → incentive email with checklist.
A read-only report then checks the tags; this repo never writes tags by API.
With no public provider configuration, the form is a local mock: it reports the
confirmation email that would be sent, without a network request or subscriber.

R11 is Kit configuration: enable the incentive email, require confirmation, and
configure "redirect to Download" with the checklist. Unconfirmed addresses must
never receive access to the checklist. The site does not deliver or host it.
Scope: every signup form on the site (preview guide, home, review pages, exit
popup) uses the selected attribution mode: one shared Kit form or one per source. `/api/newsletter` is retired on the
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
- Submit buttons stay disabled until hydration resolves the hidden fields; missing
  required configuration blocks submission.

## Attribution modes and fallback setup

Try **`hidden-tags` first**. CTO decision (22 Oct 2026): if the COO has not verified
hidden-tags against live Kit by Fri 23 Oct 2026 17:00 AEDT, the default flips to
`form-per-source`. `NEXT_PUBLIC_KIT_ATTRIBUTION` defaults to
`hidden-tags` only when unset. In this mode all placements post to
`NEXT_PUBLIC_KIT_FORM_ID`, sending the full page URL as `referrer` and one
`tags[]` ID per source/campaign tag. Behaviour is unchanged. Every listed tag ID
must be filled in `lib/attribution/tag-list.mjs` for a Kit build.

**UNVERIFIED:** whether Kit honours undeclared `tags[]` IDs and whether tags are
applied at signup or confirmation. Kit records UTM attribution but has no native
UTM-source automation trigger. If R3 shows undeclared IDs are ignored, use the
`form-per-source` fallback:

1. In Kit, create one form for **every** source key in `TAG_LIST.sources`,
   including `src-unattributed`. Enable double opt-in and configure the incentive
   email and checklist download on **each** form (R11).
2. For each form, configure a Kit automation rule: **subscribes to form X → add
   tag src-x**, using that form's matching source tag. The operator configures
   these rules in Kit; this code never creates them or applies tags by API.
3. Fill every numeric-string form ID in the committed `TAG_LIST.sourceForms`
   map in `lib/attribution/tag-list.mjs`. Keys must match all source keys and IDs
   must be distinct. Form IDs are public. Campaign tag IDs may stay null;
   configure them to attempt best-effort campaign tags[]. Source tag IDs are
   unused by the fallback browser form.
4. Set `NEXT_PUBLIC_EMAIL_PROVIDER=kit` and
   **`NEXT_PUBLIC_KIT_ATTRIBUTION=form-per-source`**, then rebuild the preview
   (`npm run check:tags` and `npm run build`). No implementation change is needed
   to switch modes once IDs and Kit rules are configured. Do not supply env JSON.
5. Repeat R3 and R11 on all source forms. The action must be
   `https://app.kit.com/forms/<sourceForms[src]>/subscriptions`, with
   `src-unattributed` selected for missing/unknown sources. Inspect `referrer`
   for the full URL. There must be **no source `tags[]` field**. A listed campaign
   ID is still sent via `tags[]`, best-effort, alongside Kit's own utm_campaign
   attribution. A missing campaign tag is a report warning in this mode.

`NEXT_PUBLIC_KIT_FORM_ID` is ignored in `form-per-source`. A null source form ID
blocks that signup. With the Kit provider, `check:tags` / build reject unknown
modes, missing tag IDs in hidden-tags, and missing or duplicate source form
IDs in fallback mode. The check stays offline. Unset the selector or set it to `hidden-tags` and
rebuild to switch back.

## Environment variable names

- NEXT_PUBLIC_EMAIL_PROVIDER
- NEXT_PUBLIC_KIT_FORM_ID
- NEXT_PUBLIC_KIT_ATTRIBUTION
- NEXT_PUBLIC_UMAMI_WEBSITE_ID
- KIT_API_KEY (operator only, for the read-only report)
- KIT_FORM_ID (operator only, for the read-only report)

Public variables are embedded at build time. The provider selects Kit only when
the provider selector is `kit`; hidden-tags also needs its positive integer public
form ID. Invalid attribution modes refuse submission.
Keep KIT_API_KEY exclusively in the operator's environment, never in public
variables, browser code or the site's hosting env. Kit API keys are not
scoped, so the report enforces read-only in code: its client can only send GET. In hidden-tags, KIT_FORM_ID must match NEXT_PUBLIC_KIT_FORM_ID. In form-per-source,
the report uses the committed sourceForms map and ignores KIT_FORM_ID; run it with
the same NEXT_PUBLIC_KIT_ATTRIBUTION=form-per-source selector as the preview build.

## Read-only tag report

The old post-confirm tagging script (which applied `src-*`/`cmp-*` tags by API)
is gone: it conflicted with "tags are set at subscribe time, never added by
hand". `node scripts/kit-tag-report.mjs` (or `npm run report:tags`) replaces it.
It takes no arguments, reads every page of the selected form (every listed
source form in fallback mode) and each
confirmed subscriber's tags, and never writes. It reports `confirmed`,
`unconfirmedSkipped`, `bySource`, `byCampaign` (with `cmp-none`), and
`violations` / `warnings` by subscriber ID only (no email addresses). Violations:
not exactly one `src-*`, more than one `cmp-*`, an unlisted src-/cmp- tag, tags
that differ from what the form sets for the UTMs Kit stored, or a tag applied
more than 24 h after signup (signs of a hand-added tag; `tagged_at` in the
response is UNVERIFIED). A mismatch when Kit stored no UTMs is only a warning.
In form-per-source, each confirmed subscriber must have exactly the source tag
mapped to the form they joined, even if Kit stored no UTMs. Source checks use
form membership. Missing expected campaign tags warn rather than violate;
multiple/unlisted tags, wrong campaign tags with stored UTMs and late tags still
violate. A subscriber in multiple forms is checked per form membership.
Exit 0 ok, 1 violations, 2 usage/config, 3 read failure.

## Reviewer preview checks

1. R1: with the default mock, visit the guide and submit a valid test address.
   Verify the mock confirmation, required/email validation, privacy link, all six
   guide blocks, AUD prices, global disclosures and noindex metadata. No provider
   request should occur. Content, price sources and dates are explicitly preview
   placeholders pending CPO anchor #1 copy.
2. Configure the public Kit provider and form ID for a separate preview build,
   trying hidden-tags first (leave NEXT_PUBLIC_KIT_ATTRIBUTION unset).
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
   already carries its tags (records the signup-vs-confirmation UNVERIFIED). If
   undeclared tags[] are ignored, follow the fallback setup above and repeat
   these checks with source-specific actions and only campaign tags[]; missing
   campaign tags are warnings in the fallback report.
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
