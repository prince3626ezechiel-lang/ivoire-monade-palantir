# WebBridge Pitfalls (verified 2026-07-12)

The most common mistake when integrating with the Kimi WebBridge daemon is **assuming the endpoint shape**. The daemon does NOT follow typical REST conventions.

## The trap

Most people guess:
```
POST http://localhost:10086/v1/browser/fetch
{"url": "...", "timeout": 30}
```

This fails silently because the daemon doesn't expose `/v1/`. You'll get 404 or a misleading error.

## Correct shape

The daemon uses a **single command endpoint** with action-based dispatch:
```
POST http://localhost:10086/command
{"action": "navigate", "url": "..."}
{"action": "snapshot", "tabId": 123}
{"action": "list_tabs"}
```

Available actions (verified 2026-07-11): `navigate`, `find_tab`, `evaluate`, `network`, `snapshot`, `click`, `fill`, `mouse_click`, `cdp`, `key_type`, `send_keys`, `screenshot`, `save_as_pdf`, `upload`, `close_tab`, `list_tabs`, `close_session`.

## How to discover

Query the daemon with an unknown action — it echoes the full list:
```bash
curl -s -X POST http://localhost:10086/command \
    -H "Content-Type: application/json" \
    -d '{"action":"help"}'
```

Response includes `"Available: navigate, find_tab, evaluate, ..."`.

## Fetch URL pattern (3-step)

```python
# Step 1: verify extension is connected
resp = requests.post("http://localhost:10086/command",
                    json={"action": "list_tabs"}).json()
if not resp.get("ok"):
    # Common: {"ok": false, "error": {"code": "tool_error",
    #           "message": "no extension connected"}}
    return  # tell user to enable extension

# Step 2: navigate (daemon picks active tab if tabId omitted)
requests.post("http://localhost:10086/command",
              json={"action": "navigate", "url": url})

# Step 3: snapshot the rendered DOM
resp = requests.post("http://localhost:10086/command",
                    json={"action": "snapshot"}).json()
# resp["snapshot"] may be HTML string or dict — handle both
```

## Failure modes to surface

| Symptom | Root cause | User action |
|---|---|---|
| Connection refused | Daemon not running | `~/.kimi-webbridge/bin/kimi-webbridge start` |
| `{"ok": false, "error": "no extension connected"}` | Extension disconnected | Open Chrome, enable extension |
| `{"ok": false, "error": "No Chrome tabs open"}` | Chrome not running | Open any tab in Chrome |

Don't pretend the layer is "trying" — surface these failures clearly with the fix command.