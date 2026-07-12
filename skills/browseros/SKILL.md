---
name: browseros
description: "Use when a task requires interacting with a website beyond just reading it — clicking elements, filling forms, submitting data, navigating through multi-step flows, taking screenshots, or any workflow where the user needs a real browser with actions like click, type, scroll, or select. Also use for managing browser bookmarks, history, or tabs. Trigger whenever the user mentions browseros, browseros-cli, or BrowserOS. Do NOT use when simply fetching or reading page content would suffice — use curl, fetch, or WebFetch for that instead."
allowed-tools: Bash(browseros-cli *)
---

# Browser Automation with BrowserOS

Control a real Chromium browser via `browseros-cli`. Run commands via Bash. Use `--json` for structured output, `-p <pageId>` to target specific tabs.

## When NOT to Use
- Headless scraping in CI/CD with no display — use Playwright or Puppeteer instead.
- Static page fetching where `curl`/`wget` suffices.

## Safety Defaults
- Default to read-only first: `snap`, `text`, `links`, `pages`, `ss`.
- Avoid `eval` unless no simpler command works.
- Save screenshots/PDFs only to user-specified or workspace paths.
- Close tabs when done: `browseros-cli close <pageId>`.

## Setup
```bash
browseros-cli --version
npm install -g browseros-cli
browseros-cli install
browseros-cli launch
browseros-cli init --auto
browseros-cli health
```

## Core Workflow: snap → act → re-snap
1. **Open** a page → get a page ID.
2. **Snap** → get element IDs like `[10] textbox "Email"`.
3. **Act** on elements by ID (`fill 10 "text"`, `click 15`).
4. **Re-snap** after ANY click, navigation, or form submit — IDs change after DOM updates.

Critical rules:
- `open <url>` = new tab. `nav <url>` = navigate current tab.
- NEVER reuse element IDs after navigation — always `snap` again.
- Use `text` for content extraction, `snap` for interaction, `ss` for visual verification.

```bash
browseros-cli open https://example.com/login
browseros-cli snap -p 5
browseros-cli fill 10 "user@example.com"
browseros-cli fill 11 "password123"
browseros-cli click 15
browseros-cli snap -p 5
browseros-cli text -p 5
browseros-cli close 5
```

## Commands Quick Reference
| Category | Key Commands |
|----------|-------------|
| **Navigate** | `open <url>`, `open --hidden`, `nav <url>`, `back`, `forward`, `reload`, `pages`, `active`, `close [id]` |
| **Observe** | `snap`, `snap -e`, `text`, `text --selector <css>`, `text --links`, `text --viewport`, `links`, `ss -o <path>`, `ss --full`, `eval "<js>"`, `dom`, `dom-search "<q>"`, `wait --text "<txt>"` |
| **Input** | `click <id>`, `click --double`, `fill <id> "text"`, `clear <id>`, `key Enter`, `hover <id>`, `focus <id>`, `check <id>`, `uncheck <id>`, `select <id> "val"`, `scroll down [amt]`, `drag <id> --to <id>`, `upload <id> <file>`, `dialog accept/dismiss` |
| **Export** | `pdf <path>`, `download <id> <dir>` |
| **Resources** | `window list/create/close/activate`, `bookmark list/search/create/remove/update/move`, `history recent/search/delete`, `group list/create/update/ungroup/close` |

## Common Patterns
### Data extraction
```bash
browseros-cli open https://example.com/data
browseros-cli text
browseros-cli text --selector "table"
browseros-cli text --links
```

### Multi-tab research
```bash
browseros-cli open https://site-a.com
browseros-cli open https://site-b.com
browseros-cli text -p 1
browseros-cli text -p 2
browseros-cli close 1 && browseros-cli close 2
```

### Web app testing
```bash
browseros-cli open http://localhost:3000
browseros-cli snap
browseros-cli ss -o test-state.png
browseros-cli eval "document.querySelectorAll('.error').length"
```

## Common Mistakes
| Mistake | Fix |
|---------|-----|
| Using CSS selectors with `fill --selector` | Always `snap` first, then use element IDs |
| Reusing element IDs after click/navigation | IDs are invalidated by DOM changes — `snap` again |
| Using `eval` to extract text | Use `text` or `text --selector` instead |
| Forgetting to close tabs | Always `close <pageId>` when done |
| Using `nav` when wanting a new tab | `nav` replaces current tab; use `open` for new tab |
| Using `open` when staying in same tab | Use `nav` instead |
| Taking screenshots for content extraction | Use `text` — screenshots burn tokens |
| Using `dialog --accept` syntax | Correct syntax is `dialog accept` or `dialog dismiss` |

## Deep-Dive Documentation
| Reference | Description |
|-----------|-------------|
| [references/cli-commands.md](references/cli-commands.md) | Full command reference with all flags |

## Links
- [BrowserOS](https://browseros.com)
- [CLI Source](https://github.com/browseros-ai/BrowserOS/tree/main/packages/browseros-agent/apps/cli)
- [MCP Setup Guide](https://docs.browseros.com/features/use-with-claude-code)
- [Skills Repository](https://github.com/browseros-ai/skills)
