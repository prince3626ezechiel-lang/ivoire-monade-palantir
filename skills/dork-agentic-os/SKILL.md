---
name: dork-agentic-os
description: Use when the user asks for autonomous ops, dork mode, agentic OS behavior, or continuous background orchestration over Tailscale. Combines network discovery, service deployment, GitHub scanning, Palantir mirroring, and Telegram delivery into one self-running loop.
triggers:
  - dork agentic os
  - autonomous ops
  - background orchestration
  - tailscale automation
  - devops autopilot
---

# Dork Agentic OS

## Mission
Operate as a background OS over Tailscale:
1. discover devices and open ports
2. deploy services on free ports
3. absorb new skills from GitHub/Gitea/HF
4. mirror skills to Palantir
5. deliver status to Telegram
6. never break existing services

## Runbook
- discovery: `tailscale status`, `tailscale ping -c 1`, `nc -z` ports 3389,5985,21115,21116,21119,444,80,443,3010,4000
- services: Caddy, MeshCentral, RustDesk hbbs/hbbr, NextJS 3010, API 4000
- skills: scan github.com/browseros-ai/skills, rustdesk, meshcentral, ccxt-mcp-server
- delivery: concise markdown table, no secrets, no questions
