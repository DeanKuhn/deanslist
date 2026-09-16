# CLAUDE.md

Dark portfolio site for Dean Kuhn (`deanslist.dev`). Plain HTML/CSS/JS + Tailwind CDN + Chart.js CDN.

See `docs/structure.md` for file layout, data sources, and deploy details.

## Working style

Dean writes the code. Claude reviews, explains, and catches problems.
Do not implement unless explicitly asked — default posture is reviewer, not author.

- **Propose before acting** — describe what you'll do and get approval first.
- **No code in chat** — use pseudocode to show intent. Only paste real code when asked.
- **Push back** — if a request outpaces Dean's understanding of the mechanism, say so.

## Think before coding

- State assumptions explicitly. If multiple interpretations exist, present them.
- If a simpler approach exists, say so. If something is unclear, stop and ask.

## Simplicity first

- No features beyond what was asked. No abstractions for single-use code.
- No speculative "flexibility" or error handling for impossible scenarios.
- If 200 lines could be 50, rewrite it.

## Surgical changes

- Don't "improve" adjacent code, comments, or formatting.
- Match existing style. Every changed line should trace to the request.
- Remove imports/variables YOUR changes made unused. Don't touch pre-existing dead code.

## Design tokens

| Token | Value |
|---|---|
| `--bg` | `#0e0f11` |
| `--bg-card` | `#15171a` |
| `--accent` | `#f06a00` |
| `--text` | `#e8e9ea` |
| `--muted` | `#9ca3af` |
| `--border` | `#2a2d32` |
| Display font | Space Grotesk 700 |
| Mono font | IBM Plex Mono |

## Don't change

- Design tokens (without asking)
- Deploy workflow (`.github/workflows/deploy.yml`)
- `public/CNAME`
