---
name: continuous-learning-v2
description: Instinct-based learning system that observes sessions via hooks, creates atomic instincts with confidence scoring, and evolves them into skills/commands/agents. v2.1 adds project-scoped instincts to prevent cross-project contamination.
metadata:
  origin: ECC
version: 2.1.0
---

# Continuous Learning v2.1 - Instinct-Based Architecture

An advanced learning system that turns your agent sessions into reusable knowledge through atomic "instincts" - small learned behaviors with confidence scoring.

**v2.1** adds **project-scoped instincts** — framework patterns stay in their project, language conventions stay in their project, and universal patterns are shared globally.

## When to Activate

- Setting up automatic learning from agent sessions
- Configuring instinct-based behavior extraction via hooks
- Tuning confidence thresholds for learned behaviors
- Reviewing, exporting, or importing instinct libraries
- Evolving instincts into full skills, commands, or agents
- Managing project-scoped vs global instincts
- Promoting instincts from project to global scope

## What's New in v2.1

| Feature | v2.0 | v2.1 |
|---------|------|------|
| Storage | Global | Project-scoped `${XDG_DATA_HOME:-~/.local/share}/ecc-homunculus/projects/<hash>/` |
| Scope | All instincts everywhere | Project-scoped + global |
| Detection | None | git remote URL / repo path |
| Promotion | N/A | Project → global when seen in 2+ projects |
| Commands | 4 | 6 (+promote/projects) |
| Cross-project | Contamination risk | Isolated by default |

## The Instinct Model

An instinct is a small learned behavior:

```yaml
---
id: prefer-functional-style
trigger: "when writing new functions"
confidence: 0.7
domain: "code-style"
source: "session-observation"
scope: project
project_id: "a1b2c3d4e5f6"
project_name: "my-app"
---

# Prefer Functional Style

## Action
Use functional patterns over classes when appropriate.

## Evidence
- Observed 5 instances of functional pattern preference
- User corrected class-based approach to functional on 2025-01-15
```

**Properties:**
- **Atomic** -- one trigger, one action
- **Confidence-weighted** -- 0.3 = tentative, 0.9 = near certain
- **Domain-tagged** -- code-style, testing, git, debugging, workflow, etc.
- **Evidence-backed** -- tracks what observations created it
- **Scope-aware** -- `project` or `global`

## How It Works

```
Session Activity
      |
      | Hooks capture prompts + tool use
      | + detect project context (git remote / repo path)
      v
+---------------------------------------------+
|  observations.jsonl                          |
|   (prompts, tool calls, outcomes, project)   |
+---------------------------------------------+
      |
      | Observer agent analyzes
      v
+---------------------------------------------+
|          PATTERN DETECTION                   |
|   * User corrections -> instinct             |
|   * Error resolutions -> instinct            |
|   * Repeated workflows -> instinct           |
|   * Scope decision: project or global?       |
+---------------------------------------------+
      |
      | Creates/updates
      v
+---------------------------------------------+
|  projects/<project-hash>/instincts/personal/ |
|  instincts/personal/ (GLOBAL)                |
+---------------------------------------------+
      |
      | /evolve clusters + /promote
      v
+---------------------------------------------+
|  projects/<hash>/evolved/                     |
|  evolved/ (global)                            |
|   * commands/new-feature.md                   |
|   * skills/testing-workflow.md                |
+---------------------------------------------+
```

## Project Detection

1. **`CLAUDE_PROJECT_DIR` env var** (highest priority)
2. **`git remote get-url origin`** -- hashed to create portable project ID
3. **`git rev-parse --show-toplevel`** -- fallback using repo path
4. **Global fallback** -- if no project detected, instincts go to global scope

Each project gets a 12-character hash ID. A registry file maps IDs to human-readable names.

### Data DirectoryStores observer data outside sensitive paths:

1. `CLV2_HOMUNCULUS_DIR` when set to an absolute path
2. `$XDG_DATA_HOME/ecc-homunculus`
3. `$HOME/.local/share/ecc-homunculus`

## Quick Start

### 1. Enable Observation Hooks

**If installed as a plugin**: Claude Code auto-loads hooks and `observe.sh` is already registered.

If installed manually, add to settings:

```json
{
  "hooks": {
    "PreToolUse": [{"matcher": "*", "hooks": [{"type": "command", "command": "<SKILL_DIR>/hooks/observe.sh"}]}],
    "PostToolUse": [{"matcher": "*", "hooks": [{"type": "command", "command": "<SKILL_DIR>/hooks/observe.sh"}]}]
  }
}
```

### 2. Initialize Directory Structure

```bash
mkdir -p "${XDG_DATA_HOME:-$HOME/.local/share}/ecc-homunculus"/{instincts/{personal,inherited},evolved/{agents,skills,commands},projects}
```

Project directories are auto-created when the hook first runs in a git repo.

### 3. Use the Instinct Commands

```bash
/instinct-status     # Show learned instincts with confidence
/evolve              # Cluster related instincts into skills/commands
/instinct-export     # Export instincts to file
/instinct-import     # Import instincts from others
/promote             # Promote project instincts to global scope
/projects            # List all known projects and their instinct counts
```

## Configuration

Edit `config.json` to control the background observer:

```json
{
  "version": "2.1",
  "observer": {
    "enabled": false,
    "run_interval_minutes": 5,
    "min_observations_to_analyze": 20
  }
}
```

## Confidence Scoring

| Score | Meaning | Behavior |
|-------|---------|----------|
| 0.3 | Tentative | Suggested but not enforced |
| 0.5 | Moderate | Applied when relevant |
| 0.7 | Strong | Auto-approved for application |
| 0.9 | Near-certain | Core behavior |

**Confidence increases** when:
- Pattern is repeatedly observed
- User doesn't correct the suggested behavior
- Similar instincts agree

**Confidence decreases** when:
- User explicitly corrects the behavior
- Pattern not observed for extended periods
- Contradicting evidence appears

## Instinct Promotion

Auto-promotion criteria:
- Same instinct ID in 2+ projects
- Average confidence >= 0.8

```bash
python3 <SKILL_DIR>/scripts/instinct-cli.py promote
python3 <SKILL_DIR>/scripts/instinct-cli.py promote --dry-run
```

## Privacy

- Observations stay local on your machine
- Project-scoped instincts are isolated per project
- Only instincts can be exported — not raw observations
- No actual code or conversation content is shared

## Related

- [ECC-Tools GitHub App](https://github.com/apps/ecc-tools) - Generate instincts from repo history
- [Hermes Agent](https://github.com/NousResearch/hermes-agent)

---
*Instinct-based learning: teaching the agent your patterns, one project at a time.*
