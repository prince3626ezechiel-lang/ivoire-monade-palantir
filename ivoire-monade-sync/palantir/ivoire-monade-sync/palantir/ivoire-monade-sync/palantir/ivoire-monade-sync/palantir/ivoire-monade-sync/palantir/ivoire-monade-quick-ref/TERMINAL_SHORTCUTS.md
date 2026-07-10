# IVOIRE MONADE Terminal Shortcuts

## Hermes Stack
```bash
cd ~/.hermes
hermes config get
hermes config set memory.provider holographic
hermes memory status
hermes mcp list
hermes mcp test n8n
hermes curator status
hermes skills list
```

## Palantir / Dark OSINT
```bash
cd ~/.hermes
python3 skills/dark-osint-palantir/scripts/ingest_cycle.py
hermes skills list | grep -E "dark-osint|palantir"
```

## RTK / OODA Trading
```bash
cd ~/.hermes
python3 scripts/rtk-ooda/run_cycle.py
python3 scripts/mcp-trading-bridge/fundamental_bot.py
python3 scripts/mcp-trading-bridge/pure_martingale.py
python3 scripts/mcp-trading-bridge/smc_4h.py
```

## Revenue Ledger
```bash
cat ~/.hermes/scripts/revenue-ledger/revenue.json
echo '{"wallet":"<ADDRESS>","target_usd":28,"status":"pending"}' > ~/.hermes/scripts/revenue-ledger/revenue.json
```

## MetaMask / Web3
```bash
# Check if Metamask CLI is installed
which metamask || echo 'metamask_cli_missing'
python3 -c "import web3; print(web3.__version__)" 2>/dev/null || echo 'web3_py_missing'
```

## OBM Core
```bash
# Backend Express
ps aux | grep -E 'node|express' | grep -v grep
curl -sS http://localhost:8080/health | head -20 || echo 'backend_down'

# Frontend Next
ps aux | grep -E 'next|node' | grep -v grep
curl -sS http://localhost:3000/ | head -20 || echo 'frontend_down'

# Quote/ticket system
cat ~/.null/inbox/*.json 2>/dev/null | head -20 || echo 'inbox_empty'
```

## GitHub
```bash
export GITHUB_TOKEN="$(gpg --quiet --decrypt ~/.gpg/github-secrets.json.gpg 2>/dev/null | python3 -c 'import sys,json; print(json.load(sys.stdin)["github"]["pat"])')"
git -C /opt/ivoire-monade/palantir status
git -C /opt/ivoire-monade/palantir log --oneline -3
curl -sS -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user/repos | python3 -c 'import sys,json; repos=json.load(sys.stdin); print("\n".join([r["full_name"] for r in repos[:10]]))'
```

## Web Search / OSINT
```bash
python3 -c "from hermes_tools import web_search; print(web_search(query='OpenAlgo India broker API', limit=5))"
python3 -c "from hermes_tools import web_extract; print(web_extract(urls=['https://docs.openalgo.in']))"
```

## Cron
```bash
cd ~/.hermes
hermes cron list
hermes cron run <job_id>
hermes cron pause <job_id>
hermes cron resume <job_id>
```

## Vault
```bash
# Decrypt secrets (never log output)
gpg --quiet --decrypt ~/.gpg/github-secrets.json.gpg > /tmp/.github-token.json
gpg --quiet --decrypt ~/.gpg/wallet-secrets.json.gpg > /tmp/.wallet-secrets.json
# Shred temp files after use
shred -u /tmp/.github-token.json /tmp/.wallet-secrets.json
```

## Security
```bash
cd ~/.hermes
grep -RInE "GenP|android-cracker|010-Editor-Keygen|guardian|Pr3m13rBank1ng|medium-unlocker" skills/ | head -20
hermes security scan
```

## n8n Workflows
```bash
curl -s http://localhost:5678/healthz
hermes mcp test n8n
```

## Troubleshooting
```bash
# Hermes logs
tail -100 ~/.hermes/logs/*.log

# Session metadata
cd ~/.hermes && python3 -c 'import json; sessions=json.load(open("sessions/sessions.json")); [print(k) for k in sessions.keys() if k!="_README"]'

# Rate limit GitHub (fix with vault)
export GITHUB_TOKEN="$(gpg --quiet --decrypt ~/.gpg/github-secrets.json.gpg 2>/dev/null | python3 -c 'import sys,json; print(json.load(sys.stdin)["github"]["pat"])')"
```

## Aliases (add to ~/.bashrc)
```bash
alias h='cd ~/.hermes'
alias hconfig='hermes config'
alias hm='hermes memory'
alias hmcp='hermes mcp'
alias hcur='hermes curator'
alias hskills='hermes skills'
alias hpal='cd ~/.hermes && python3 skills/dark-osint-palantir/scripts/ingest_cycle.py'
alias hrtk='cd ~/.hermes && python3 scripts/rtk-ooda/run_cycle.py'
alias hrev='cat ~/.hermes/scripts/revenue-ledger/revenue.json'
alias hgh='export GITHUB_TOKEN="$(gpg --quiet --decrypt ~/.gpg/github-secrets.json.gpg 2>/dev/null | python3 -c '"'"'import sys,json; print(json.load(sys.stdin)["github"]["pat"])'"'"')"'
alias hgit='git -C /opt/ivoire-monade/palantir'
```

