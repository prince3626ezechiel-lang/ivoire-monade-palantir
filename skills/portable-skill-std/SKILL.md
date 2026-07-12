---
name: portable-skill-std
description: >
  Portable open-standard skill package inspired by soonjune/skills and the broader
  SKILL.md ecosystem. Minimal, cross-agent skill scaffold that can be reused across
  Claude Code, OpenClaw, Hermes, and other SKILL.md-speaking agents.
version: 0.1.0
author: soonjune community adaptation
source: https://github.com/soonjune/skills
license: MIT
metadata:
  hermes:
    tags: [skill, scaffold, portable, open-standard, minimal]
    related_skills: [new-skill, agentiko-hermes, skillhone]
---

# Portable Skill Standard

A minimal reusable skill package for Hermes/OpenClaw/Claude Code.

## Layout
```
portable-skill-std/
  SKILL.md
  scripts/
    optional helpers
  references/
    optional markdown references
```

## Usage
Load as a skill in profiles or compose into larger skills.

## Reference
- soonjune/skills: portable SKILL.md skills.
- hiendinhngoc/unknowns: agent skills for discovering unknowns.
