# Output Formats

## Default output

`openalex` prints human-readable Markdown by default.

## Machine-readable output

Use `--json` to get raw JSON for downstream parsing or scripting.

```bash
openalex works search "transformers" --per-page 1 --json
```

`--plain` removes Markdown formatting (no bold, no links).

```bash
openalex works search "transformers" --per-page 1 --plain
```

## Summary mode

Use `--summary` after lookup commands to get a compact single-line result.

```bash
openalex works get W2741809807 --summary
```

## Output fields

Every entity result includes its `id`, `display_name`, `works_count` / `cited_by_count` when available,
and a `link` to the public OpenAlex landing page. Works include `publication_year`, `doi`, and title.
Authors include `works_count`, `cited_by_count`, and `last_known_institutions`.
