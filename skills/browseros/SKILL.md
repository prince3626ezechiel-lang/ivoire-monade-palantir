name: browseros
description: Control a real Chromium-based browser from the agent using the browseros-cli binary. Activate when the user mentions browseros, browseros-cli, BrowserOS, or needs live-browser automation (open pages, click elements, fill forms, take screenshots, extract rendered content). Do NOT activate for simple HTTP fetching — use curl or fetch/WebFetch instead.

---

# BrowserOS Skill

Use 'browseros-cli' to drive a real Chromium browser session. Every command returns a structured result (text, screenshot path, or element ref).

## Installation Check

Run this first to confirm browseros-cli is available:

```
browseros-cli --version
```

If not installed, inform the user and stop — do not attempt alternative browser tooling while this skill is active.

## Core Commands

### Session
- `browseros-cli open <url>` — open URL in new tab, returns tab ID
- `browseros-cli close <tab-id>` — close tab
- `browseros-cli list-tabs` — list open tabs with IDs and URLs
- `browseros-cli screenshot [tab-id]` — capture page screenshot, returns file path
- `browseros-cli pdf [tab-id]` — export current page as PDF

### Navigation
- `browseros-cli back <tab-id>` — navigate back
- `browseros-cli forward <tab-id>` — navigate forward
- `browseros-cli reload <tab-id>` — reload page
- `browseros-cli goto <tab-id> <url>` — navigate tab to new URL

### DOM Interaction
- `browseros-cli click <tab-id> <selector>` — click element by CSS selector
- `browseros-cli type <tab-id> <selector> <text>` — fill input field
- `browseros-cli select <tab-id> <selector> <value>` — select dropdown option
- `browseros-cli scroll <tab-id> <direction>` — scroll up/down/element
- `browseros-cli hover <tab-id> <selector>` — hover over element
- `browseros-cli press <tab-id> <key>` — send key press (e.g. Enter, Escape, Tab)

### Data Extraction
- `browseros-cli text <tab-id> [selector]` — extract visible text (all page or scoped)
- `browseros-cli html <tab-id> [selector]` — extract inner HTML
- `browseros-cli attributes <tab-id> <selector> [attr]` — read element attributes
- `browseros-cli links <tab-id>` — list all anchor hrefs on the page

### Auth & State
- `browseros-cli cookies <tab-id>` — dump cookies (JSON)
- `browseros-cli set-cookie <tab-id> <name> <value>` — inject cookie
- `browseros-cli local-storage <tab-id> [key]` — read/write localStorage

### Evaluation
- `browseros-cli eval <tab-id> '<js-expression>'` — execute JavaScript and return result

## Usage Pattern

1. **Identify the task.** If static fetching (GET/POST without browser rendering) suffices, use curl instead.
2. **Open a session.** `browseros-cli open https://target` → get tab ID.
3. **Extract or interact.** Use DOM commands to collect data or drive the UI.
4. **Capture evidence.** Always call `screenshot` after significant interactions.
5. **Close cleanly.** `browseros-cli close <tab-id>` when done.

## Important Constraints

- Refuse if browseros-cli is not installed.
- Do not use `eval` to execute untrusted code from remote pages.
- Screenshots are stored in a temp directory; preserve the returned path before the next command overwrites it.
- Maximum 20 commands per session before recommending a tab close/reopen cycle.

## Anti-Triggers (do NOT activate)

- User asks to fetch a URL with curl or wget — no browser interaction needed.
- User is reading machine-readable content (API JSON, XML, etc.).
- User explicitly requests a headless/renderless approach that curl can handle.
