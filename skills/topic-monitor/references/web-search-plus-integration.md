# Topic Monitor + web-search-plus Integration Notes

## Known Bug: search_web early return on empty extraction (FIXED)

**Symptom:** `search_web()` returns `([], None)` even when web-search-plus has valid results.

**Root cause:** `common.py` `search_web()` tries multiple search attempts in order:
1. `--type news --topic news --compact`
2. `--type search --compact`
3. fallback without `--type`

The news search (attempt 1) often returns valid JSON but with an `answer` field and no `results` list matching the expected format. `extract_results()` returns an empty list. The original code then returned `([], None)` immediately instead of trying the next attempt.

**Fix (applied 2026-04-29):** In `common.py` `search_web()`, changed:
```python
# OLD — returns even if extraction found nothing
return extract_results(payload), None

# NEW — only returns if results were actually extracted
results = extract_results(payload)
if results:
    return results, None
if verbose:
    errors.append("search returned valid JSON but no extractable results")
```

This allows the function to fall through to the next search attempt (general search) which typically produces results.

**Verification:**
```python
from common import search_web
results, err = search_web('test query', limit=3, verbose=True)
assert len(results) > 0, f"Expected results, got {len(results)}: {err}"
```

## Provider Routing

web-search-plus auto-routes between providers (Serper, Linkup, Tavily, Exa, etc.). Topic Monitor does not need to configure provider routing — it delegates entirely to web-search-plus. The `WSP_CACHE_DIR` env var is set to `<topic-monitor-data-dir>/.wsp-cache` to avoid polluting the main search cache.

## Configuration

Topic Monitor does not need its own search API keys in `.env`. web-search-plus reads keys from `~/.hermes/.env`. The topic-monitor `.env` is only for `TOPIC_MONITOR_TELEGRAM_ID` delivery routing.
