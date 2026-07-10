# tradehook-skill

An [OpenClaw](https://openclaw.ai) skill that lets you control [tradehook](https://github.com/byte-wizard140/tradehook) — a community bridge for TradeMAV signals — directly from your AI assistant.

## What you can do

- Check if the bridge is running and view recent logs
- See recent signals and orders
- Toggle `dry_run` on/off (with confirmation before going live)
- Add/remove tickers from the excluded list
- Adjust thresholds and quantities
- Start/stop the bridge process

## Install

```bash
npx clawhub@latest install tradehook
```

Or via the native OpenClaw CLI:

```bash
openclaw skills install tradehook
```

## Setup

Point the skill at your tradehook directory in the first message:

> "My tradehook is at ~/Documents/tradehook"

The assistant will remember it for the session.

## Requirements

- [tradehook](https://github.com/byte-wizard140/tradehook) installed locally
- Python 3.9+
- OpenClaw with bash tool access

## Notes

- API keys and secrets are never displayed
- Live trading requires explicit confirmation
- Works on macOS, Linux, and Windows (PowerShell commands substituted automatically)

---

Not affiliated with TradeMAV. Community skill, community tool.
