---
name: ui-ux-pro-max
description: >-
  UI/UX design intelligence for building professional interfaces across web and
  mobile platforms. Use when the task involves UI structure, layout, styling,
  color palette, typography, or visual design for any supported frontend stack
  (React, Next.js, Vue/Nuxt, Svelte, SwiftUI, React Native, Flutter,
  HTML5/Tailwind). Provides decision-ready references: 50+ proven UI styles
  (ELLE, Modern SaaS, Glassmorphism, Neo-Brutalism, …), 161 color palettes,
  57 font pairings, 161 product types with reasoning rules, 99 UX guidelines,
  and 25 chart types across 10 technology stacks. Recommendations are
  priority-ranked.
license: MIT
source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
tags:
  - ui
  - ux
  - design
  - frontend
  - interface
  - styling
  - react
  - vue
  - svelte
  - flutter
  - swiftui
---

# UI/UX Pro Max — Design Intelligence

Searchable design intelligence for AI coding assistants. Contains 50+ verified
UI styles, 161 color palettes, 57 font pairings, 161 product types with
reasoning rules, 99 UX guidelines, and 25 chart types across 10 technology
stacks. Recommendations are priority-ranked.

## When to Use

- User asks to "design", "build", "style", "redesign", or "improve" a UI
- User asks what style, color, font, or layout to use for a page or component
- User needs a chart type or data-visualization recommendation
- User is building for a known product type (e-commerce, SaaS dashboard,
  educational platform, fintech, social, admin, …)
- User asks for accessibility- or performance-oriented UX guidance

Do NOT use for:
- Non-visual logic (API design, database schema, algorithms)
- Content writing or copy (use a writing skill instead)
- Backend architecture decisions

## Prerequisites

The skill ships as a self-contained SKILL.md with embedded reference tables.
No installation, API key, or external tool is required. Activate by reading
this file and following the workflow steps below.

## Core Workflow (4 mandatory steps)

### 1. Analyze Requirements

Extract:
- **Product type** — e-commerce, SaaS dashboard, educational, fintech,
  healthcare, social, portfolio, admin, media, enterprise, gaming, travel, …
- **Style keywords** — modern, minimal, playful, dark-mode, retro,
  glassmorphism, brutalist, corporate, warm, luxurious
- **Technology stack** — React, Next.js, Vue/Nuxt, Svelte, HTML+Tailwind,
  React Native, Flutter, SwiftUI, plain HTML5/CSS
- **Constraints** — accessibility (WCAG AA/AAA), dark mode, RTL, print,
  performance budget

### 2. Search Domains

Query the reference tables below in this order:

1. **Product Types (161)** — match product type → default style + palette + top UX
2. **UI Styles (50+)** — narrow by style keywords + stack compatibility
3. **Color Palettes (161)** — validate contrast and accessibility
4. **Font Pairings (57)** — match product type + tone
5. **Typography** — apply hierarchy rules for the chosen stack
6. **UX Guidelines (99)** — enforce priority-ordered UX constraints
7. **Charts (25)** — pick chart type for the data shape

Cross-reference at least two domains before finalizing a design decision.
Document which references informed each choice.

### 3. Apply Priority-Ranked Recommendations

Rank rules:
1. Exact product-type match (highest priority)
2. Style keyword overlap
3. UX guideline constraints (accessibility > performance > aesthetics)
4. Stack-specific best practices

Produce a short **Design Decision Record** before writing code:
```
Style:  <name> — matches product type <X> and keyword <Y>
Palette: <primary> + <secondary> — contrast ratio <N>:1
Fonts:  <heading> + <body> — hierarchy H1/H2/body
UX:     <top 3 guidelines by risk>
```

### 4. Document References in Code

Inline comments should cite the applied rule set:
```tsx
/* Style: Modern SaaS (product-type: saas-dashboard)   */
/* Palette: Indigo-600 / Slate-900 (contrast 8.2:1)    */
/* UX: WCAG AA ≥ 4.5:1 · keyboard-navigable nav        */
```

When generating new pages, check for a
`design-system/pages/[page-name].md` file; if present, prioritize its brand
rules over generic recommendations.

## Reference Tables

### Product Types (161)

Map product type → default style + recommended palette + UX focus.

| Product Type           | Default Style      | Priority UX Constraint              |
|------------------------|--------------------|-------------------------------------|
| SaaS Dashboard         | Modern SaaS        | Data-density + keyboard nav         |
| E-Commerce             | Minimal Clean      | Trust + checkout accessibility      |
| Educational Platform   | Friendly Warm      | Readability + 16px minimum font      |
| Fintech                | Corporate Trust    | WCAG AA + error-state clarity       |
| Healthcare             | Clinical Minimal   | High contrast + print-friendly      |
| Social / Community     | Vibrant Modern     | Avatar consistency + dark mode      |
| Admin Panel            | Functional Dark    | Table readability + keyboard nav    |
| Portfolio / Creative   | Artistic Bold      | Typography hierarchy + hero impact  |
| Gaming                 | Playful Dark       | Contrast + motion-preference        |
| Travel / Booking       | Aspirational Light | Image-to-text ratio + CTA clarity   |

For unlisted product types, choose the closest semantic match and state the assumption explicitly.

### UI Styles (50+)

Verified design system templates with component-level guidance.

| Style Name         | Best For                        | Stack Notes                    |
|--------------------|---------------------------------|--------------------------------|
| Modern SaaS         | Dashboards, B2B tools           | React/Next.js, Tailwind        |
| ELLE (editorial)    | Magazines, content sites        | Next.js, CSS modules           |
| Glassmorphism       | Hero sections, landing pages    | Any — CSS backdrop-filter      |
| Neo-Brutalism       | Portfolios, dev tools           | Any — bold borders, no shadow  |
| Soft UI             | Kids, wellness, playful apps    | Flutter, SwiftUI               |
| Dark Enterprise     | Internal tools, analytics       | React, Vue, Svelte             |
| Minimal Clean       | E-commerce, docs                | Any                            |
| Vibrant Social      | Community, social apps          | React Native, Flutter          |
| Luxury High-End     | Fashion, premium products       | Next.js, SwiftUI               |
| Corporate Trust     | Fintech, healthcare             | React + Tailwind               |

For unlisted styles, pick the visually closest listed style and document the mapping.

### Color Palettes (161)

Each palette: primary, secondary, accent, semantic colors
(success/warning/error/neutral), and WCAG contrast ratios.

Selection rules:
1. Primary-on-background contrast: target ≥ 4.5:1 (AA), ≥ 7:1 (AAA).
2. Dark mode: invert semantic roles (warning more saturated, errors amber-shifted).
3. Monochromatic palettes: avoid for data-dense dashboards; always include a chart accent.

Generate palette tokens per stack:
- React/Next.js/Tailwind → `tailwind.config.ts` `colors` object
- CSS Modules → `:root` variables
- SwiftUI → `Color` extensions
- Flutter → `ThemeData.colorScheme`

### Font Pairings (57)

Curated Google Font + system font combinations.

Rules:
1. Heading weights: ≥ 600 H1, ≥ 500 H2.
2. Max 2 families per product (heading + body). Avoid decorative fonts in body.
3. Base size: 16px web / 14pt native. Modular-ratio 1.250 (major third).
4. Line height: 1.5–1.7 body; 1.1–1.3 headings.

Stack notes:
- React/Next.js/Tailwind → `tailwind.config.ts` `fontFamily`
- Vue/Nuxt → same Tailwind config or `@import`
- Svelte → `app.css` or Tailwind plugin
- React Native → `expo-font` or native assets
- Flutter → `ThemeData.textTheme`
- SwiftUI → `.font(.custom(...))`

### Typography Hierarchy

Driven by product type:
- SaaS/Admin: condensed sans headings, high-density body
- E-Commerce: H1 32–48px, price H2 24px, large product titles
- Educational: generous line-height (1.75), max-width 65ch
- Fintech: tabular figures for numbers, tight tracking for labels
- Gaming: large display headings, short body copy

### UX Guidelines (99) — Risk Priority Order

Apply top items first:
1. **WCAG AA/AAA** — contrast, focus indicators, keyboard traps, ARIA labels
2. **Keyboard navigation** — all interactive elements reachable via Tab
3. **Mobile touch targets** — 44×44px iOS, 48×48dp Android
4. **Error prevention** — confirm destructive actions, inline validation
5. **Loading states** — skeleton > spinner for data tables
6. **Empty states** — always provide a first-action CTA
7. **Dark mode** — semantic colors invert correctly
8. **Form labels** — floating labels > placeholder-only inputs

### Chart Types (25)

Recommended by data shape:
| Data Shape          | Chart Type          | Notes                      |
|--------------------|--------------------|-----------------------------|
| Part-to-whole      | Donut/Stacked bar  | ≤ 7 segments                |
| Time-series        | Line/Area          | Smooth for trends, step for events |
| Comparison         | Grouped bar        | Max 8 groups, ≤ 5 series    |
| Distribution       | Histogram/Box      | Bin count = √n              |
| Correlation        | Scatter            | Trendline for ≥ 30 pts      |
| Hierarchy/flow     | Treemap/Sankey     | Limit depth to 3 levels     |
| Geospatial         | Choropleth/Bubble  | Brewer scale, no rainbow    |

## Source

https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
MIT License
