---
name: agentiko-hermes
description: Hermes Agent features guide — cron, delegation, memory, automation, YOLO mode, dual-agent hunting, and slash commands for the agentiko Telegram setup
tags: [hermes, gateway, telegram, cron, delegation, memory, automation, yolo, dual-agent, redteam]
related_skills: [agentiko-worker, hermes-agent]
version: 3.0
---

# Agentiko Hermes

Hermes Agent features guide running on Telegram with SSH worker backend.

## Architecture — Dual Container

The agentiko setup runs two Docker containers that communicate via SSH:

```
Telegram ──→ agentiko-hermes (172.20.0.3) ──SSH──→ agentiko-worker (172.20.0.2)
                   │                                         │
                   │ /opt/data/                               │ /root/
                   │ ├── AGENTS.md   (read at boot)           │ ├── output/recon_us/
                   │ ├── SOUL.md     (reference)              │ ├── tools/
                   │ ├── skills/207  (skill library)          │ ├── scripts/
                   │ └── config.yaml                          │ └── .ssh/
                   │                                         │
                   │ Runs Hermes Agent core                   │ Runs recon tools
                   │ Reads AGENTS.md/SOUL.md at boot          │ Executes nmap/curl/python3
                   │ Loads skills from /opt/data/skills/      │ No /opt/data/ access
                   │ Handles Telegram chat                    │ Pure execution node
```

**Important**: When you are in the worker terminal (SSH), you will NOT find AGENTS.md, SOUL.md, or /opt/data/. Those live on the Hermes host. This is correct behaviour — the worker is a pure execution environment.

**Connection:** Telegram → Hermes Gateway → Worker SSH (Alpine container)
**Toolkit:** nmap, masscan, ffuf, nuclei, httpx, subfinder, dnsx, Python 3, gcc, git, and 199+ skills (21 recon, 100+ redteam, 4 meta, 4 apple, 2 chains, plus built-in)

**Language policy:** ALL output — responses, documentation, reports, findings — in English. Always. No exceptions.

---

## Slash Commands (Telegram)

Commands that work in this chat:

| Command      | What it does                                      |
|--------------|---------------------------------------------------|
| `/model <name>` | Switch model (e.g. `/model deepseek/deepseek-flash`) |
| `/model`     | Show current model                               |
| `/config`    | Show current config                              |
| `/reset`     | Fresh session                                    |
| `/yolo`      | Toggle YOLO mode (skip dangerous command approvals) |
| `/title <name>` | Name the session                              |
| `/skills`    | Manage skills                                    |
| `/skill <name>` | Load a skill into session                     |
| `/platforms` | Show connected platform status                   |
| `/status`    | Current session info                             |
| `/profile`   | Active profile                                   |
| `/usage`     | Token usage                                      |
| `/help`      | List commands                                    |
| `/cron`      | Manage scheduled jobs                            |
| `/search <query>` | Search past conversations                |
| `/retry`     | Resend last message                              |
| `/stop`      | Kill background processes                        |

> **Important:** Do NOT run `hermes` commands in the worker terminal — they don't exist there. Use slash commands in chat.

---

## YOLO Mode

Skips dangerous command approval prompts. Useful for active hunting sessions where every command would otherwise block.

### Enable via chat

```
/yolo
```

Toggles on/off. Immediate effect.
