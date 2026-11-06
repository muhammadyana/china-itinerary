# AGENTS.md

`CLAUDE.md` is the full guide to this repository (commands, architecture, deployment, content rules). Read it before changing anything. The rules below are the ones agents most often get wrong.

## Language

- English for code identifiers, comments, test descriptions, commit messages and developer docs.
- Bahasa Indonesia for user-facing interface copy, and for replies to the owner in chat.
- Preserve source place names and Chinese characters.

## Working rules

- No tests: do not write new ones, do not run the existing suites, and keep them out of CI (owner, 6 November 2026). Verify with `npx tsc` and `npm run build`, plus a 390px-wide screenshot for layout changes; the owner reads the site on an iPhone.
- Commit and push each finished change to `main` after those checks pass. No co-author trailer.
- The calm option (`src/calm-*.ts`, `/places/calm-itinerary/`) is the active plan. Leave the main-plan pages alone unless asked.
- Never invent prices, times or durations; mark unchecked figures as estimates. Mark a booking as done only from the owner's confirmation.
- Do not revert the owner's own edits. Secrets come only through the T3 `request_secret` tool, never through chat or the repo.
- A change under `ops/ask/` is live only after the trip assistant is reinstalled on the server (see "Deployment" in `CLAUDE.md`).
