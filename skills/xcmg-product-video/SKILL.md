---
name: xcmg-product-video
description: >
  Génère des vidéos produit 30s pour engins BTP CI : XCMG XC7 et FAW BA.
  Couvre storyboard, prompts IA, script VO, assemblage MP4, publication visuel.
  Use when the user asks for vidéo pro XCMG/FAW, présentation équipement, vidéo chantier, pub BTP CI.
category: creative
---

# XCMG Product Video — Skill vidéo pro 30s

## Rôle
Produire des publicités courtes pour engins XCMG/FAW sur le marché ivoirien/africain.
Format prioritaire : vertical 9:16 + carré 1:1 pour WhatsApp/FB.

## Entrées
- `product`: `xcmg_xc7` | `faw_ba` | `both`
- `duration`: `30` (secondes)
- `market`: `CI` | `Africa`
- `style`: `cinematic` | `commercial` | `social_proof`

## Pipeline
1. Choisir le template storyboard adapté
2. Construire les prompts image par plan
3. Générer la VO texte via TTS ou speech synthesis
4. Assembler avec ffmpeg en MP4 1080x1920 + 1080x1080

## Sorties attendues
- `storyboard-30s.md`
- `prompts/*.txt`
- `audio/vo_segments.wav`
- `output/xcmg-faw-30s.mp4`
- `output/xcmg-faw-30s-square.mp4`

## Règles strictes
- Hook 0–5s = problème chantier, jamais la marque d’abord
- 4 mots max par carte texte
- Sous-titres obligatoires
- CTA unique : WhatsApp +225 07 88 62 61 25
- Pas de texte anglais pour marché CI

## Templates
Voir `templates/storyboard-30s.md`
Voir `templates/ffmpeg-assemble.sh`

## Scripts
Voir `scripts/assemble_video.py`
