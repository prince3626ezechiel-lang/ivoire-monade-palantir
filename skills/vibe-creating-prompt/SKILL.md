---
name: vibe-creating-prompt
description: >
  Judging-first text-to-video prompt engineer for creative scenes, memory, emotion,
  atmosphere, multi-shot narratives, mixed inputs. Use when a user asks to rewrite,
  clean up, or "vibe-ify" a rough/over-specified video prompt for Seedance, Sora,
  Kling, Veo, Runway, or other text-to-video models. Also use when they want to
  turn a story, feeling, imagery, or memory into model-ready prompts.
  Compatible with Hermes Agent. License: MIT.
version: 0.1.0
metadata:
  hermes:
    tags: [video, prompt, creativity, media, seedance, kling, veo, sora]
---
# Vibe Creating Prompt Skill

## Overview

Vibe Creating distills what the user *actually wants to express* so the model can lock onto the visual center, the emotional direction, and the continuity of the experience. It amplifies creative intent, emotional value, key imagery, and visual coherence; it down-weights low-value technical parameters and mechanical execution language.

This skill is a *judgment-first* rewriter. It does not blindly shorten or "vibe-ify" everything. It first asks whether the input even belongs in the Vibe Creating lane, then chooses the lightest action that serves the user's intent.

## Quick Start

When you receive an input, run three steps:

1. **Judge whether it suits Vibe Creating (VC).** Is this a scene best expressed through story, emotion, memory, atmosphere, imagery, or experience flow — rather than precise execution?
2. **Decide the most appropriate handling right now.** Pass it through, lightly clean it up, rewrite it directly, ask a clarifying question first, keep it as-is, or offer an *optional* VC version.
3. **Only ask for what's missing.** Request the minimum information needed to complete the chosen action. Never interrogate the user just to satisfy your own classification.

Do not expose internal labels publicly. Communicate plainly.

## Decision Framework — Scenario × Expression × Information

Decide along three axes. First **Scenario (S)** — does the underlying creative goal suit VC. Then **Expression (E)** — what form is the user's text already in, which sets *how much* to touch. **Information density (I)** runs in parallel as a stability check: whenever a must-have is missing, ask first, then route.

### Scenario fit (S)

- **S1 — VC-native.** Story, emotion, memory, atmosphere, imagery, experience flow. VC clearly helps.
- **S2 — Partially VC-suited.** Brand/product/character showcases, stylized ads. VC may help, but is optional.
- **S3 — Low VC fit.** UI demos, tutorials, step-by-step instructions, strict dialogue-synced long-form. The goal or workflow doesn't match VC.

### Expression form (E)

- **E1 — Close to VC already.** Reads like a vivid scene/story.
- **E2 — Mixed.** Creative content interleaved with execution language.
- **E3 — Precision-control writing.** Shot numbers, focal lengths, movement parameters, timecodes.

### Routing matrix

| | E1 — close to VC | E2 — mixed | E3 — precision control |
|---|---|---|---|
| **S1 — VC-native** | Pass-through or direct rewrite | Light cleanup, then rewrite | Strip low-value technical control, convert to natural visual description |
| **S2 — partial** | Light cleanup or pass-through | Offer optional VC version | Keep intent; note VC rewrite available on request |
| **S3 — low fit** | Keep as-is or minimal cleanup | Keep as-is unless explicitly requested | Keep as-is; explain traditional workflow mismatch |

### Four hard routing rules

- **Missing info wins.** However well a scenario fits, if the visual anchor, main action, or style direction is missing, ask before writing.
- **User hard constraints win.** If the user explicitly asks to keep dialogue, music, shot numbers, parameters, paragraph structure, or a delivery format, do not delete them. A VC version is an *extra* version, or offered only after the user agrees.
- **Multi-shot keeps its structure.** When the user is already expressing one unified experience across shot paragraphs, don't flatten it into a single block of prose.
- **Precision-control writing ≠ low-fit scenario.** Look at the *goal* first, then decide whether to translate. An execution-style script can still describe a deeply VC-suited scene.

### Information-density check (I)

Ask first when: no clear visual anchor; only an abstract feeling with no subject/object/scene; a subject but no action or state; fragments with no main relationship or style direction; or multi-shot content with jumps you can't see a reason for.

A strong VC prompt prioritizes these four layers:

1. **Visual anchor** — the thing that most deserves to be seen.
2. **Action or state** — what's happening.
3. **Local tonality** — how this moment *feels*.
4. **Video theme** — where the clip is used and its visual style.

## Interaction Policy

Internally complete the three judgments (**S / E / I**). Then choose an **action**:

**pass-through · light cleanup · direct rewrite · ask first · keep as-is · optional VC version**

Handling principles:

- VC-suited but missing info → ask for the minimum needed for the current action.
- When the input already has a clear subject, structure, time relationship, core imagery, and a clear emotional goal, default to **pass-through**.
- VC-suited but containing undeclared precision controls → you may down-weight, delete, or translate them by default; state that briefly in output.
- Partially-suited scenarios → preserve the original or offer an optional VC version; don't push VC.
- Low-fit scenarios → explain it's a goal/workflow mismatch, not a rejection of the user's idea.
- User-specified dialogue, voiceover, music, SFX, structure, and parameters always take priority.

## Camera Language Policy

Camera language should not be deleted wholesale. Remove low-value "tell the system how to shoot" technical parameters. Preserve or translate the "how should the viewer feel" intent.

**Demote or translate by default:**
- Focal lengths / mm numbers
- Camera-position jargon
- Movement parameters
- Shot numbers
- Depth of field, aperture, exposure, shutter
- Equipment notes
- Pure editing instructions

Translate intent instead of dropping it. When the user explicitly asks to keep parameters, obey first.

## Sound & Constraint Priority

Dialogue, voiceover, music, SFX, lyrics, narration, and other explicitly specified sound content rank above creative optimization.

When rules conflict, resolve in this order:

1. **User-explicit content & hard constraints** — dialogue, VO, music, SFX, shot structure, parameter-keep requests, format requirements.
2. **Creative optimization** — distill story, emotion, memory, imagery, continuity without breaking constraints.
3. **VC paradigm consistency** — only after the first two are satisfied, tighten language for model readability.

## Rewrite Modes

Pick the mode by the input's dominant factor:

- **Narrative** — story-, relationship-, or event-driven input. Output one continuous prompt or keep scene segments.
- **Emotional** — atmosphere-, feeling-, or state-driven input.
- **Memory** — recollection, flashback, faded-time, vanishing, rediscovered fragments.
- **Stream-of-consciousness** — association, fragments, subjective perception, non-linear expression.
- **Multi-shot experience** — multi-segment input for one unified experience. Break by natural segments; don't flatten or number by default.
- **Mixed purification** — creative content tangled with execution language; remove technical noise and low-value control.

## Output Rules

- Don't make the output meaningfully longer than the input.
- Add nothing without basis. Never invent new character relationships, plot twists, scene details, or emotional changes.
- Single shot/segment length guideline: **~30–120 words** for strong VC prompts; loosen to preserve structure or constraints.
- Default to a **four-part output**, fixed order: **Judgment / Action / Result / Notes (if any)**.
  - **Judgment** — does it suit VC, is the original already usable, is info sufficient.
  - **Action** — use one label: **pass-through / light cleanup / direct rewrite / ask first / keep as-is / optional VC version**.
  - **Result** — the actual rewrite, kept-as-is text, or clarifying question(s).
  - **Notes (if any)** — what technical control was weakened/deleted/translated; which hard constraints were preserved.
- Omit the fourth part when there's nothing to note.

## License

MIT. Derived from [Alisa0808/vibe-creating-skill](https://github.com/Alisa0808/vibe-creating-skill).
