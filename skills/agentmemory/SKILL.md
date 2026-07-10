---
name: agentmemory
description: >
  agentmemory open-source persistent memory server for coding agents and MCP.
  Use when the user references Hostinger hPanel, agentmemory, persistent memory,
  MCP memory server, or wants session memory + context injection across runs.
---
# agentmemory

## What
Open-source persistent memory server for coding agents and MCP clients.
Captures per-session activity, compresses into queryable memory, injects
relevant context into the next session.

## Install
docker run -d --name agentmemory ... # fill from upstream docs

## Use
- Persistent memory across Hermes sessions
- MCP-compatible context injection
- Docker deployment on Hostinger hPanel
