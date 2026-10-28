# CaseBridge AI — Lean build roadmap

Oct 28, 2026 · @Krishna

## The approach

**Build a fast, clickable prototype first, then add one real feature at a time.** The earlier blueprint is the long-term vision. This roadmap is the order to build it in, so the app is demo-able after about a week and never gets slow.

Three rules for every stage:

1. **Every click responds in under 100 ms on screen.** Data may take longer, but the button, page and skeleton must react at once.
2. **A stage is finished only when its "done when" check passes.** Then move on, never earlier.
3. **Heavy things stay out of the click path.** AI matching, OCR, emails and reports run in the background.

## Why clicks take 5 to 7 seconds, and the rules that prevent it

I have not seen your earlier code, so these are the usual causes. Share the repo or a Network-tab screenshot and I can point to the real one.

| Likely cause | Rule to follow |
| --- | --- |
| All rows loaded, then filtered in the browser | Server-side pagination: 20 rows per request, filters run in the database |
| Database or server asleep (free-tier hosts pause when idle) | Keep it awake with a 5-minute ping, or use an always-on tier for the demo; host app and database in the same region |
| Slow queries with no indexes | Index every column you filter or sort on; check slow queries with `EXPLAIN ANALYZE` |
| Many small queries per page (N+1) | One joined query per screen; fetch related data together |
| Dashboard counts computed live over every case | Keep a small summary table updated by the app or a job; tiles read one row |
| Page waits for data before showing anything | Render the layout and skeleton instantly; fill data when it arrives |
| One huge JavaScript bundle (charts, OCR, AI libraries) | Lazy-load heavy libraries per route; the landing page ships almost no JavaScript |
| Running the dev server or an unoptimised build | Test the production build (`next build`) on the deployed URL |
| AI or email work inside the request | Queue it; the click returns at once and the result arrives later |

**Speed budget to test against:** button reacts in under 100 ms, list API under 300 ms, page ready in under 2 s on a mid-range phone with throttled 4G. Check with Chrome Lighthouse and the Network tab at the end of every stage.

**Client habits:** cache fetched data with TanStack Query, prefetch the next page and likely routes, update the screen before the server replies when it is safe (for example marking a notification read), and debounce search typing by 300 ms.

## Build order

Days are rough for a small team working in parallel; stretch or squeeze them to your SIH deadline. Stack for all stages: Next.js + TypeScript + Tailwind + shadcn/ui, PostgreSQL (Supabase or Neon), deployed early on Vercel.

| Stage | What you build | Days | Done when |
| --- | --- | --- | --- |
| 0. Setup and speed baseline | Repo, folders per portal, deploy a blank app, ESLint, Lighthouse check, seed-data plan | 1 | The deployed blank app scores 90+ on Lighthouse performance |
| 1. Clickable prototype with fake data | Landing page, login and sign-up (fake sessions with a role picker), four portal shells, dashboards, case tables with pagination, case detail with timeline, responsive layouts | 4 | You can demo all four portals on a phone and a laptop; every click reacts in under 100 ms |
| 2. Real database and fast lists | Schema for institutions, users, complaints, case events; seed 300 institutions and 3,000 cases; list API with filters, pagination and search; indexes; dashboard summary table | 3 | List API under 300 ms with 3,000 cases, and still under 300 ms when you test with 50,000 |
| 3. Authentication and roles | Real sign-up and login (Supabase Auth or Auth.js), email OTP, roles, route guards, API permission checks, institution isolation | 3 | A college account cannot read another college's cases through the UI or by editing the API request |
| 4. Core case lifecycle | Complaint submission wizard, status changes, assignment, transfer, response, history timeline, student tracking, in-app notifications | 4 | One case travels from student submission to a recorded decision across all four portals |
| 5. Overlap alerts | Alert 1 (coordination) as a database query; Alert 2 (related cases) with name matching and background-computed embeddings; explanation panel; link and dismiss | 4 | Seeded overlaps are found, unrelated pairs are not, and a labelled test set reports precision and recall |
| 6. Verification, email, deadlines | Roster CSV upload, affiliation match and review queue, email notifications through a queue, deadline job with reminders | 3 | A wrong or unclaimed enrollment goes to review, and reminders reach the right person only |
| 7. Reports and polish | Report pages with CSV and PDF export, Hindi labels, installable PWA, accessibility pass | 3 | Every report from the problem statement exports; Lighthouse accessibility 90+ |
| 8. Hardening and demo rehearsal | Role tests, load test, security checks, scripted five-minute demo | 2 | The demo runs three times in a row with no failure |

Total is about 27 working days. If time is short, stop after Stage 5 and rehearse: that is a complete, convincing project.

## Stage 1 prototype: screens in each portal

Fake data lives in local JSON behind a small mock API with the same URLs and response shapes the real API will use, so Stage 2 swaps the data source and the screens stay unchanged.

| Area | Screens |
| --- | --- |
| Public | Landing page (what it is, how it works, four role cards, sign in), login, sign-up with role choice, 404 |
| Student / alumnus | Dashboard (my cases, status chips), new-complaint wizard (3 steps), case detail with timeline and messages, notifications |
| Faculty | Assigned-cases inbox, case detail with response form, recuse button |
| College management | Dashboard (open, overdue, responded), referred cases table, assign-to-member dialog, committee list |
| AICTE | Dashboard with KPI tiles and Bureau workload bars, all-cases table with filters, institution profile with case history, case detail with history and transfer, alert centre (two alert types, link or dismiss), reports page (stub) |

**Shared building blocks to make first:** app shell with sidebar that becomes a bottom bar on phones, data table with server-style pagination, status chip, KPI tile, timeline, empty and loading states, toast messages. Building these once keeps the portals consistent and the code small.

**Fake login for now:** pick a role, get a cookie, land on that portal. Real authentication is Stage 3, so the prototype can be shown immediately.

## Pagination and search spec

- **20 rows per page**, requested from the server with `?page=` and `limit=20`. Never fetch all cases.
- **Filters and sort run in SQL**, with indexes on institution, Bureau, status, region, category, date. Filter state lives in the URL so pages can be shared and the back button works.
- **Search** by institution name, AICTE ID, case ID: use a prefix match first, add `pg_trgm` fuzzy matching in Stage 2. Debounce 300 ms.
- **Deep lists:** switch to keyset pagination ("after this case") once offset paging gets slow; show "1–20 of about 3,000" from a cached count instead of counting every time.
- **Feel:** show the table skeleton at once, keep the previous page visible while the next loads, prefetch the next page when the user reaches the last rows.
- **Mobile:** rows become cards; "Load more" replaces page numbers.

## What moves to later or gets cut

| Item from the big blueprint | When |
| --- | --- |
| OCR for ID cards and receipts | After Stage 6, only if everything else is stable |
| RAG policy assistant | After Stage 7, optional |
| Marathi and voice input | Stretch after Stage 7 |
| Offline mode | Student drafts only, after Stage 7; field-visit mode is future work |
| Hash-chained audit log | Plain append-only events table in Stage 4; hash chain is a small add-on in Stage 8 |
| Web Push and SMS | Future work; in-app and email are enough |
| DigiLocker and APAAR | Future work; show as a labelled mock |
| Real-time live updates | Use a 30-second refresh at first; add Server-Sent Events only if needed |

Keep the four-portal structure, both alerts and the role-based permissions: they are what judges will remember. The rest is polish you add only when the stage checks pass.
