# Sutra Studio — Admin

Welcome to Sutra Studio's admin app. You're joining as a support engineer. The studio owner just forwarded you two customer messages — they're at the bottom of this README. Your job: reproduce each, find the root cause, fix it, and write a short note explaining what you found and what we changed.

## Setup

```bash
yarn         # install dependencies
yarn dev     # http://localhost:3000
```

That's it — no environment variables, no external services.

## Project structure

```
app/         pages and API routes (Next.js App Router)
lib/         shared code — db helpers, cart, promo, email service
data/        seed data, stored as JSON files
logs.txt     structured app logs (one JSON line per entry)
```

## What's already set up — and what isn't

- **Auth is mocked.** Assume the logged-in user is the studio owner.
- **No real database.** Records live in `data/*.json` and are mutated in place by `lib/db.ts`.
- **Emails don't actually send.** `lib/email/send.ts` appends structured lines to `logs.txt` instead. Existing seeded log lines were produced the same way.
- **No payment processor.** A "charge" is just a row appended to `data/charges.json`.

## Using AI

You're encouraged to use whatever AI tools you'd normally reach for — Claude, Cursor, Copilot, whatever. Treat it like a normal day at work.

## How you'll be evaluated

- Reproducing each bug before fixing it.
- Finding the root cause rather than patching a symptom.
- Considering side effects and regressions.
- Communicating the fix in plain customer language at the end.

---

## Customer Reports

### Report 1

> **From:** Sarah (Sutra Studio owner)
> **Subject:** My promo codes aren't actually discounting anything??
>
> Hey — I set up a 25% off promo code for our 10-Class Pack (code SUMMER25). I tested it myself and it looked fine — when I went through checkout, it showed the discount, said the total was $150 instead of $200, all good. But two clients have now messaged me saying their card was charged the full $200. I checked our charges file and they're right, $200 each, but the promo code IS recorded on the charge. So the code "applied" but didn't apply?? I'm going to look so unprofessional refunding all of these manually. Please figure out what's going on.

### Report 2

> **From:** Sarah (Sutra Studio owner)
> **Subject:** Some clients aren't getting any emails
>
> So a bunch of our newer members have been telling me they never got their welcome email or any reminders. I checked spam — nothing. But other clients are getting emails just fine. I asked our developer where to find logs and she pointed me at `logs.txt` in our repo, I've left it for you. I'm worried we're going to lose new members if they think we ghost them after signup. Please look into this asap.
