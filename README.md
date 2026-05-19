# Arketa — Admin

Welcome to Arketa's admin app. You're joining as a support engineer. The studio owner just forwarded you two customer messages — they're at the bottom of this README. Your job: reproduce each, find the root cause, fix it, and write a short note explaining what you found and what we changed.

## Time

You have **50 minutes**. We're evaluating your ability to read and navigate an unfamiliar codebase, so **no questions will be answered about the code structure** — figure it out from the code itself, the same way you would on your first week at a new job.

## Setup

```bash
yarn         # install dependencies
yarn dev     # http://localhost:3000
```

That's it — no environment variables, no external services.

## Project structure

```
app/         pages and API routes (Next.js App Router)
lib/         shared code — db helpers, auth, cart, promo, email service
data/        seed data, stored as JSON files
logs.txt     structured app logs (one JSON line per entry)
```

## What's already set up — and what isn't

- **Auth is mocked.** Assume the logged-in user is the studio owner. Two studios are seeded — switch between them via the dropdown in the sidebar.
- **No real database.** Records live in `data/*.json` and are mutated in place by `lib/db.ts`.
- **Emails don't actually send.**
- **No payment processor.**

## Using AI

AI assistants (Claude, Cursor, Copilot, etc.) are allowed and encouraged — use them the way you would at work.

What is **not** allowed is handing the problem off to the model with a blind prompt like _"find the bug and fix it"_ or _"here's the customer report, fix it"_. We want to see **you** reading the code, forming a hypothesis, and directing the tool — not the tool driving you. Use AI for the kind of help a senior teammate would give: explaining an unfamiliar pattern, sanity-checking a fix. Not for replacing the investigation itself.

## How you'll be evaluated

- Reproducing each bug before fixing it.
- Finding the root cause rather than patching a symptom.
- Code reading and navigation — moving through the repo with intent.
- Considering side effects and regressions.
- Communicating the fix in plain customer language at the end.

---
