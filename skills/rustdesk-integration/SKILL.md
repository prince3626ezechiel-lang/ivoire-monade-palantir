---
name: rustdesk-integration
description: Use when Hermes needs remote desktop, file transfer, terminal, or audio streaming for Windows/Android/Linux/macOS devices on the tailnet. Self-hosted relay/hbbs/hbbr exposes no public desktop. Trigger when user asks for remote control of 100.107.172.47, 100.101.115.101, MeshCentral fallback, or BrowserOS CDP.
home: /opt/ivoire-monade/rustdesk
server_id: 100.69.73.44
ports: 21115/tcp, 21115/udp, 21116/tcp, 21119/tcp
---

# RustDesk Self-Hosted Integration

## Binary rule
If this skill is activated, copy/paste only: 
- hbbs logs: `docker logs rustdesk-hbbs --tail 50`
- hbbr logs: `docker logs rustdesk-hbbr --tail 50`
- restart: `cd /opt/ivoire-monade/rustdesk && docker compose down && docker compose up -d`
- health: `ss -ltnp | grep -E ':21115|:21116|:21119'`
- Do not reinvent bootstrap.

## Server
- hbbs id/relay: 100.69.73.44
- hbbr relay/fallback: 100.69.73.44
- Docker volumes: /opt/ivoire-monade/rustdesk/data
- Public route: https://ivoire-monade.shop/rustdesk/

## Client pairing rules
- Windows 100.107.172.47: ID server = 100.69.73.44
- Android 100.101.115.101: ID server = 100.69.73.44
- Expect DERP fallback first; direct works when both ends are on tailnet/open NAT.

## Session hygiene
- Always close remote desktop session when done.
- Do not store fixed passwords in chat; pass through vault if needed.
- Do not use eval/installer unless the user explicitly asks for local install.
