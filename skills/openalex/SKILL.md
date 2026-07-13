---
name: openalex
description: Use when the user asks about academic literature, research papers, scholarly works, authors, citations, institutions, journals, or any academic metadata. Trigger when users want to search for papers, find author profiles, track citations, discover related works, or explore academic topics. Also use when users mention DOIs, ORCIDs, h-index, publication venues, or research metrics.
---

# OpenAlex CLI Skill

Use the `openalex` CLI to retrieve academic metadata from the OpenAlex API.

## When to Use

Invoke this skill when the user needs to:
- Search for academic papers or scholarly works
- Find information about authors, institutions, or journals
- Track citations (who cited a paper, what a paper references)
- Discover related works or research topics
- Look up metadata by DOI, ORCID, or OpenAlex ID
- Analyze publication trends or research metrics

## Initial Setup

**First time using this skill?** Read [references/setup.md](references/setup.md) for installation and API key configuration.

## Prerequisites

The CLI must be built and available. Check with:
```bash
openalex --help
```

If `openalex` is not installed yet, install it first:
```bash
npm install -g openalex-skill
openalex --help
```

For installation, persistent API key setup, and first-run verification, see `references/setup.md`.

## Core Commands

### Entity Types
OpenAlex organizes data into 8 entity types:
- `works` - research papers, articles, preprints
- `authors` - researchers and their profiles
- `sources` - journals, conferences, repositories
- `institutions` - universities, research centers
- `topics` - research areas and subjects
- `publishers` - academic publishers
- `funders` - funding organizations
- `concepts` - (legacy) subject classifications

### OpenAlex ID Format

**ID format:** OpenAlex IDs start with `W` (e.g., `W2626778328`). The `summary` format displays reusable IDs on a secondary line:

```
- Attention Is All You Need (2017 | cited 6519)
  id: W2741809807  |  authors: Vaswani et al  |  doi: https://doi.org/10.48550/arXiv.1706.03762
```

**Get ID from search results:**
```bash
openalex works search "paper title" --per-page 1
# Copy the `id: Wxxxx` from the output
```

**⚠️ ID usage restrictions:**
- `cited-by`, `references`, and `related` support both DOI and OpenAlex ID
- bare DOIs like `10.1038/nature12373` and `doi:10.1038/nature12373` are normalized automatically for work lookups and helpers
- OpenAlex IDs are still the most reusable follow-up identifiers when chaining multiple commands

### Common Operations

**Search for papers:**
```bash
openalex works search "your query" --per-page 5
```

**Get specific work by ID or DOI:**
```bash
openalex works get W2741809807
openalex works get https://doi.org/10.1038/nature12373
openalex works get 10.1038/nature12373
```

**Find author:**
```bash
openalex authors search "Author Name" --per-page 3
```

**Get author by ORCID:**
```bash
openalex authors get https://orcid.org/0000-0002-3141-5845
```

**Track citations:**
```bash
# Papers that cite this work
openalex works cited-by W2741809807 --per-page 5
openalex works cited-by 10.1038/nature12373 --per-page 5
openalex works cited-by https://doi.org/10.1038/nature12373 --per-page 5

# Papers this work references
openalex works references W2741809807 --per-page 5
openalex works references https://doi.org/10.1038/nature12373 --per-page 5

# Related works
openalex works related W2741809807 --per-page 5
openalex works related https://doi.org/10.1038/nature12373 --per-page 5
```

**Filter and sort:**
```bash
openalex works list \
  --filter publication_year:2024 \
  --filter is_oa:true \
  --sort cited_by_count:desc \
  --per-page 10
```
