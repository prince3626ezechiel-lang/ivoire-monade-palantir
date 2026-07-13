---
name: graphify
description: Turn a folder of code, docs, papers, or images into a queryable knowledge graph with JSON, HTML, Obsidian vault, and plain-language reports.
trigger: /graphify
---

# graphify

Convert any corpus folder into a navigable knowledge graph: persistent JSON, interactive HTML, Obsidian vault, and a grounded GRAPH_REPORT.md.

## Dependencies

```bash
python3 -c "import graphify" 2>/dev/null || pip install graphifyy -q --break-system-packages 2>&1 | tail -3
```

## Minimal Hermes-compatible commands

```bash
/graphify <path>                            # full pipeline on a path
/graphify <path> --mode deep                 # aggressive inferred edges
/graphify <path> --update                    # incremental update since last run
/graphify <path> --wiki                      # add agent-crawlable wiki articles
/graphify <path> --neo4j                     # export cypher for Neo4j
/graphify <path> --mcp                       # start graphify MCP stdio server
/graphify query "<question>"                 # answer from graph
/graphify path "A" "B"                       # shortest path between concepts
/graphify explain "<concept>"                # plain-language node explanation
/graphify add <url>                          # fetch URL and ingest into graph
/graphify <path> --watch                     # auto-rebuild on code changes
```

## What it produces

- `graphify-out/graph.json` — persistent GraphRAG-ready graph
- `graphify-out/graph.html` — searchable interactive graph
- `graphify-out/obsidian/` — ready-to-open Obsidian vault
- `graphify-out/GRAPH_REPORT.md` — god nodes, surprising connections, suggested questions

## Notes

- Path defaults to `.` if omitted.
- HTML viz is skipped above 5000 nodes; use Obsidian vault instead.
- Every edge is tagged EXTRACTED, INFERRED, or AMBIGUOUS with a confidence score.
- Use `--update` after adding files to avoid full re-extraction.
- For MCP server access: add `python3 -m graphify.serve /absolute/path/to/graphify-out/graph.json` to your MCP config.
