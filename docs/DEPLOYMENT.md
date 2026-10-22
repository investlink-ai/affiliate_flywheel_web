# Deploy to Production (Vercel)

Step-by-step guide to deploy the Affiliate Flywheel site to Vercel with GA4 enabled.

## Prerequisites

- [x] Code pushed to GitHub (e.g. `main` or `dev` branch)
- [x] [Vercel account](https://vercel.com/signup) (GitHub login recommended)
- [x] GA4 Property and Web Data Stream created ([Google Analytics](https://analytics.google.com/))

---

## 1. Import project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import Git Repository**: Select **GitHub** and authorize if needed.
3. Find and select **affiliate_flywheel_web** (or your repo name).
4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: (leave default; Next.js uses `.next`)
   - **Install Command**: `npm ci` (recommended for CI consistency)
5. **Do not deploy yet** — add environment variables first (Step 2), then deploy.

---

## 2. Environment variables

In the Vercel project **Settings → Environment Variables**, add:

| Variable                         | Required | Description                                     | Example               |
| -------------------------------- | -------- | ----------------------------------------------- | --------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Yes      | Canonical site URL (sitemap, schema)            | `https://investlink.com` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`  | Yes      | GA4 Measurement ID                              | `G-XXXXXXXXXX`        |
| `NEXT_PUBLIC_GA_FORCE_ENABLE`    | No       | Set `true` to enable GA in dev                  | (leave unset in prod) |
| `KIT_API_KEY`                   | No       | Not used by the site or its build (ops scripts only); never expose it | Kit > Account Settings > Developer |
| `KIT_FORM_ID`                   | Yes*     | Kit hosted form ID; inlined at build so signup forms post to Kit (signup hidden if unset) | From form URL (e.g. /forms/123456/edit → 123456) |

*Required for newsletter to actually collect emails. Without these, signups are logged only and not stored.

- Apply to **Production** (and Preview if you want GA in preview deployments).
- Get **GA4 Measurement ID**: [Google Analytics](https://analytics.google.com/) → Admin → Data Streams → your Web stream → Measurement ID (`G-...`).

---

## 3. Deploy

1. After saving environment variables, go to **Deployments**.
2. Click **Redeploy** on the latest deployment, or trigger a new deploy by pushing to the connected branch.
3. Wait for the build to finish (lint → type-check → test → build in CI; Vercel runs `npm run build` by default).
4. Open the **Production URL** (e.g. `https://your-project.vercel.app`).

---

## 4. Verify

- **Site**: Homepage, review pages, comparisons, and quiz load correctly.
- **GA4**:
  - Open GA4 → **Reports → Realtime** and visit your site; your visit should appear.
  - Click an affiliate CTA and confirm an event (e.g. `affiliate_click`) in Realtime or DebugView (if enabled).
- **PWA**: In browser DevTools → Application → Service Workers, confirm the worker is registered (if PWA is enabled).

---

## 5. Custom domain (optional)

1. **Settings → Domains** → Add your domain (e.g. `investlink.com`).
2. Add the DNS records Vercel shows (A/CNAME).
3. After DNS propagates, Vercel will issue SSL and the site will be served on your domain.
4. Update `NEXT_PUBLIC_SITE_URL` to your production domain and redeploy.

---

## Post-deploy checklist

- [x] Production URL loads and navigation works.
- [x] GA4 Realtime shows your visit.
- [x] Affiliate link click sends `affiliate_click` (or equivalent) in GA4.
- [x] Newsletter signup: Kit (ConvertKit) integrated — set `KIT_FORM_ID` in Vercel env vars (the site itself never uses a Kit API key).
- [x] Sitemap: `https://your-domain.com/sitemap.xml` returns the expected URLs.
- [x] Optional: Connect a custom domain and set `NEXT_PUBLIC_SITE_URL`.

---

## Troubleshooting

| Issue                             | Check                                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build fails                       | Ensure Node 20 (Vercel uses this by default; see `.nvmrc`). Run `npm run ci` locally; fix any lint/type/test errors.                              |
| GA4 not receiving events          | Confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in Vercel and redeploy. No trailing space. Open site and check Network tab for `gtag/js?id=G-...`. |
| 404 on review pages               | Dynamic routes are pre-rendered at build; ensure `lib/data.ts` tools are available at build time.                                                 |
| PWA / service worker not updating | Hard refresh or clear site data; next-pwa regenerates worker on each build.                                                                       |

---

## CI and branch behaviour

- **GitHub Actions** (`.github/workflows/ci.yml`) runs on push/PR to `main` and `dev`: lint, type-check, test, build.
- **Vercel**: Connect the branch you want for production (e.g. `main`). Pushes to that branch trigger a production deploy. Other branches get Preview deployments if configured.

Once deployed, use the first 2–4 weeks to collect baseline data (affiliate clicks, signups) and establish EPC before larger optimizations.
