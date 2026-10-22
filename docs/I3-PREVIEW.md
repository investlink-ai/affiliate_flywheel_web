# I3 preview path

Open `/guides/preview-ai-research-checklist?utm_source=x&utm_campaign=i3-preview`.
The path is guide → browser POST to Kit hosted form → Kit double opt-in →
incentive email with checklist → offline source/campaign tagging.
With no public provider configuration, the form is a local mock: it reports the
confirmation email that would be sent, without a network request or subscriber.

R11 is Kit configuration: enable the incentive email, require confirmation, and
configure "redirect to Download" with the checklist. Unconfirmed addresses must
never receive access to the checklist. The site does not deliver or host it.
Scope: only the preview guide uses the hosted/mock opt-in. The existing
SignupForm (home, review pages, exit popup) and `/api/newsletter` are unchanged
in this branch. That route creates Kit subscribers by API with
`state: 'active'`, which skips double opt-in and loses attribution; retiring it
(or moving every placement to the hosted form) is an open decision for CTO.

## Environment variable names

- NEXT_PUBLIC_EMAIL_PROVIDER
- NEXT_PUBLIC_KIT_FORM_ID
- NEXT_PUBLIC_UMAMI_WEBSITE_ID
- KIT_API_KEY
- KIT_FORM_ID

Public variables are embedded at build time. The provider selects Kit only when
the provider selector is `kit` and its public form ID is a positive integer.
Keep KIT_API_KEY exclusively in the operator's environment, never in public
variables or browser code. The offline form ID must match the public form ID.

## Offline tagging

Run `node scripts/kit-tag-sources.mjs --dry-run` with operator credentials already
in the environment. Dry-run is also the default when no flag is supplied; it
reads subscribers and existing tags but never creates tags or assignments.
Run `node scripts/kit-tag-sources.mjs --apply` only when ready to write. If both
flags are present, dry-run wins. Missing credentials or an invalid form ID exit 2.
Summary JSON goes to stdout; progress uses subscriber IDs only on stderr.
`confirmed` counts active subscribers, `unconfirmedSkipped` counts other states,
`bySource` counts confirmed subscribers per source, and `tagged` / `alreadyTagged`
count individual source and campaign assignments. Dry-run `tagged` stays zero.
Re-running skips assignments already present. All form pages are read.

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
   Inspect Kit's stored `referrer_utm_parameters`. Run the offline script first
   in dry-run, then with `--apply`; confirm distinct `src-x`, `src-youtube`, and
   `src-newsletter` assignments, `cmp-i3-preview`, and `src-unattributed` for the
   missing/unknown sources. The unconfirmed signup must have no tags. Rerun to
   verify zero new assignments. Confirm no email appears in script logs.
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
is unverified until the R3 preview test; strict-origin-when-cross-origin otherwise
strips query strings from the HTTP Referer header. Live Kit payload shapes,
confirmation, incentive email/download configuration, unsubscribe, real
attribution persistence, and Umami Cloud collection need the manual checks above.
Cloudflare Pages deployment and its actual security headers are not verified;
no new server route, API handler or middleware is introduced by this preview.
