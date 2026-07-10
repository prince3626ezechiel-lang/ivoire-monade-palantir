---
name: tradehook
description: Control and monitor tradehook, a local TradeMAV signal bridge. Use when the user wants to start or stop the bridge, check recent signals, toggle dry-run mode, manage excluded tickers, or view the current config. Requires tradehook installed locally. Run `python bridge.py` in the tradehook directory to start.
homepage: https://github.com/byte-wizard140/tradehook
user-invocable: true
---

## What tradehook is

tradehook is a local Python bridge that reads TradeMAV signals (from SQLite or ntfy) and forwards them to a broker or webhook. It runs as a background process on the user's machine and writes timestamped logs to `tradehook.log` in the project directory.

This skill lets you control it conversationally.

## How to find the tradehook directory

If the user hasn't told you the path, check these common locations:
- `~/tradehook`
- `~/Documents/tradehook`
- Ask the user: "Where did you clone tradehook?"

Store it as `TRADEHOOK_DIR` for this session.

## Commands (run in `bash` tool from TRADEHOOK_DIR)

### Check status
```bash
# Is bridge.py running?
pgrep -f "bridge.py" && echo "RUNNING" || echo "STOPPED"

# Show last 20 log lines
tail -20 tradehook.log 2>/dev/null || echo "No log file yet."
```

### Show config (sanitize secrets)
```bash
python3 -c "
import json
cfg = json.load(open('config.json'))
safe = {k: v for k, v in cfg.items() if 'key' not in k.lower() and 'secret' not in k.lower() and 'token' not in k.lower()}
print(json.dumps(safe, indent=2))
"
```

### Start the bridge (background)
```bash
nohup python3 bridge.py --config config.json > /dev/null 2>&1 &
echo "Started (PID $!)"
```

### Stop the bridge
```bash
pkill -f "bridge.py" && echo "Stopped." || echo "Not running."
```

### Toggle dry_run
```bash
# Enable dry_run (safe mode — no real orders)
python3 -c "
import json
cfg = json.load(open('config.json'))
cfg['dry_run'] = True
json.dump(cfg, open('config.json', 'w'), indent=2)
print('dry_run set to TRUE — no orders will be placed.')
"

# Disable dry_run (live trading — be careful!)
python3 -c "
import json
cfg = json.load(open('config.json'))
cfg['dry_run'] = False
json.dump(cfg, open('config.json', 'w'), indent=2)
print('dry_run set to FALSE — LIVE orders enabled.')
"
```

Always confirm with the user before disabling dry_run. Say: "This will enable live order placement. Are you sure?"

### Add ticker to excluded list
```bash
# Replace TICKER with the actual ticker
python3 -c "
import json
cfg = json.load(open('config.json'))
excl = cfg.get('excluded_tickers', [])
if 'TICKER' not in excl:
    excl.append('TICKER')
    cfg['excluded_tickers'] = excl
    json.dump(cfg, open('config.json', 'w'), indent=2)
    print('Added TICKER to excluded_tickers.')
else:
    print('TICKER already excluded.')
"
```

### Remove ticker from excluded list
```bash
python3 -c "
import json
cfg = json.load(open('config.json'))
excl = cfg.get('excluded_tickers', [])
if 'TICKER' in excl:
    excl.remove('TICKER')
    cfg['excluded_tickers'] = excl
    json.dump(cfg, open('config.json', 'w'), indent=2)
    print('Removed TICKER from excluded_tickers.')
else:
    print('TICKER was not excluded.')
"
```

### Show recent signals (parsed from log)
```bash
grep '\[SIGNAL\]' tradehook.log 2>/dev/null | tail -20 || echo "No signals logged yet."
```

### Show recent orders
```bash
grep '\[ORDER\]\|\[DRY RUN\]' tradehook.log 2>/dev/null | tail -20 || echo "No orders logged yet."
```

### Set minimum confidence threshold (min_strength)
```bash
python3 -c "
import json
cfg = json.load(open('config.json'))
cfg['min_strength'] = THRESHOLD
json.dump(cfg, open('config.json', 'w'), indent=2)
print('min_strength set to THRESHOLD')
"
```
Replace THRESHOLD with the float value the user wants (e.g. 0.80).

### Set quantity for a ticker
```bash
python3 -c "
import json
cfg = json.load(open('config.json'))
cfg.setdefault('quantities', {})['TICKER'] = QTY
json.dump(cfg, open('config.json', 'w'), indent=2)
print('Set TICKER quantity to QTY.')
"
```

## Important rules

- Never display API keys, secret keys, or tokens from config.json.
- Always confirm before disabling dry_run.
- If the bridge is running when config changes are made, remind the user to restart it: "Restart the bridge for changes to take effect: `pkill -f bridge.py && nohup python3 bridge.py &`"
- On Windows, replace `nohup` / `pkill` / `pgrep` with:
  - Start: `Start-Process python -ArgumentList "bridge.py","--config","config.json" -NoNewWindow`
  - Stop: `Get-Process python | Where-Object {$_.CommandLine -like "*bridge.py*"} | Stop-Process`
  - Status: `Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*bridge.py*"}`
