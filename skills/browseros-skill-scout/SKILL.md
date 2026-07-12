# browseros-skill-scout

**Source repo:** `browseros-ai/skills`
**Hermes profiles:** default, browseros

## Purpose
Scan open-source skill ecosystems for high-value, reusable Hermes-compatible skills. Prefer low-credit-impact endpoints, validate reuse potential, and report only actionable candidates.

## When to use
- Periodic discovery of new skills from GitHub, Gitea, HuggingFace spaces/tools, or curated repos.
- Ensuring `browseros-agent/skills` source of truth is included in every scan.
- Finding exactly 1 new skill per run and integrating it into `~/.hermes/skills/` and the Palantir remote path.

## Behavior
1. Search GitHub via `octocat/search/repositories` or low-credit README extraction first.
2. Always include and review `browseros-agent/skills` in results.
3. Check local `~/.hermes/skills/` and Palantir `/opt/ivoire-monade/palantir/skills/` to avoid duplicates.
4. For a new candidate, create `~/.hermes/skills/<name>/SKILL.md`.
5. Push to Palantir with `git add/commit/push` under `/opt/ivoire-monade/palantir/skills/<name>/`.
6. Report only: repo + skill name + action taken.

## Constraints
- Minimal, focused output.
- Do not modify existing configuration.
- Do not break existing skills or paths.
- Never deliver fabricated skill content; push only when a real, validated candidate is found.
