---
name: hermes-agent-docs
description: "Documentation-driven workflow for installing, configuring, operating, and troubleshooting Hermes Agent. Use for setup, providers, gateway, messaging channels, tools, local models, upgrades, and runtime failures."
---

# Hermes Agent Documentation Skill

Use this skill for Hermes Agent setup, upgrades, provider setup, local model wiring, messaging channel setup, MCP/plugins/tools questions, and runtime troubleshooting.

## Refresh Boundary

1. If `<skill-directory>/.git` exists, try:
   ```bash
   git -C <skill-directory> pull origin main --ff-only
   ```
2. If refresh fails, continue silently with the local copy.
3. Do not execute scripts in `scripts/` during normal skill usage.
4. Do not try to initialize or rebuild this repo during normal troubleshooting.
5. Read `SKILL.md` plus `references/` only.

## Required Entry Point

Always check `references/index.md` first to locate the relevant documentation.

For setup or troubleshooting, do not answer from one page alone. Read the matching workflow pages from the lookup map below and then synthesize.

## Core Lookup Map

| Task | Start Here |
| --- | --- |
| Find the right doc | `references/index.md` |
| Fresh install | `references/getting-started/installation.md` |
| Quick bootstrap path | `references/getting-started/quickstart.md` |
| Updates / uninstall | `references/getting-started/updating.md` |
| Platform-specific install | `references/getting-started/nix-setup.md`, `references/getting-started/termux.md` |
| Main configuration | `references/user-guide/configuration.md` |
| AI providers / local models | `references/integrations/providers.md` |
| Common failures | `references/reference/faq.md` |
| Messaging overview | `references/user-guide/messaging/index.md` |
| Specific channel setup | files under `references/user-guide/messaging/` |
| Tools / toolsets | `references/reference/tools-reference.md`, `references/reference/toolsets-reference.md` |
| MCP | `references/user-guide/features/mcp.md`, `references/reference/mcp-config-reference.md` |
| Plugins | `references/user-guide/features/plugins.md` |
| Architecture / internals | `references/developer-guide/architecture.md` |

## Working Rules

1. Prefer local docs over memory when details conflict.
2. Repeat exact command names, env vars, and file paths from the docs.
3. If a question is platform-specific, identify the platform before prescribing commands.
4. If the docs support multiple paths, state which path you are choosing and why.
5. When troubleshooting, give the user a validation order, not only a reference link.

## Workflow For Setup And Troubleshooting

Use this order for questions like "install Hermes", "why is Hermes not starting", "how do I connect Telegram", "how do I use Ollama", or "why is my provider failing".

1. Identify context first:
   - OS or platform: macOS, Linux, WSL2, Termux, Nix
   - install method: one-line installer or manual
   - provider: OpenRouter, Anthropic, local endpoint, etc.
   - feature area: CLI, gateway, messaging, MCP, plugins, browser, cron
2. Read `references/index.md`.
3. Read the relevant getting-started page.
4. Read `references/user-guide/configuration.md`.
5. If the issue involves model auth or model selection, read `references/integrations/providers.md`.
6. If the issue involves a channel or bot, read `references/user-guide/messaging/index.md` plus the specific channel page.
7. Read `references/reference/faq.md` for common failure patterns.
8. Answer in this order:
   - environment / platform fit
   - install or config state
   - provider or credential state
   - feature-specific setup
   - concrete verification step

## Mandatory Branches

### Installation Branch

- Use `references/getting-started/installation.md` first.
- If the user is on native Windows, do not suggest native install. The docs say to use WSL2.
- If the user is on Android, branch to `references/getting-started/termux.md`.
- If the user uses Nix or NixOS, branch to `references/getting-started/nix-setup.md`.

### Provider Branch

- Use `references/integrations/providers.md`.
- For general provider setup, prefer `hermes model` when the docs offer an interactive path.
- For direct config, use the exact env var names and config keys from the docs.
- For local models, treat them as custom endpoint setup and confirm base URL, model name, and context length.

### Messaging Branch

- Use `references/user-guide/messaging/index.md` plus the specific channel page.
- Separate channel bootstrap from agent config. Users often have a valid bot token but incomplete Hermes config, or the reverse.
- For Telegram, use `references/user-guide/messaging/telegram.md` and check bot token, allowed user IDs, gateway mode, and webhook vs polling choice.

## Troubleshooting Order

When the user reports a broken setup, check these in order:

1. Wrong platform or unsupported install path.
2. `hermes` command not on PATH or install incomplete.
3. Missing or conflicting config in `~/.hermes/config.yaml` and `~/.hermes/.env`.
4. Provider credentials or model ID mismatch.
5. Terminal backend or sandbox backend misconfiguration.
6. Channel-specific secrets, allowlists, or webhook settings.
7. Only then dig into deeper feature internals, plugins, or tool runtime behavior.

## Minimum Questions To Ask When Context Is Missing

- Which platform are you on?
- Did you install with the one-line installer or manually?
- Which provider or model are you trying to use?
- Which feature is failing: CLI, gateway, channel, tools, MCP, plugin, cron, browser?
- What is the exact error message?

## Output Style

1. Start with a short diagnosis.
2. Give an ordered set of steps.
3. Name the docs used.
4. Call out platform-specific branches explicitly.
5. End with the next concrete verification command or action.
