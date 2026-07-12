#!/bin/bash
set -euo pipefail
REPORT="/tmp/dork-agentic-os-report.txt"
: > "$REPORT"

echo '---discovery---' >> "$REPORT"
tailscale status 2>/dev/null | sed -n '1,8p' >> "$REPORT" || echo 'tailscale_cli_missing' >> "$REPORT"

echo '---ping---' >> "$REPORT"
tailscale ping -c 1 desktop-hqu8nk4 >/dev/null 2>&1 && echo 'windows_online' >> "$REPORT" || echo 'windows_offline' >> "$REPORT"
tailscale ping -c 1 zchiel-leprince >/dev/null 2>&1 && echo 'android_online' >> "$REPORT" || echo 'android_offline' >> "$REPORT"

echo '---ports---' >> "$REPORT"
for host in 100.107.172.47 100.101.115.101; do
  for port in 3389 5985 21115 21116 21119 444 80 443 3010 4000; do
    nc -z -w 1 "$host" "$port" 2>/dev/null && echo "${host}:${port}_open" >> "$REPORT" || echo "${host}:${port}_closed" >> "$REPORT"
  done
done

echo '---services---' >> "$REPORT"
ss -ltnp | grep -E ':80 |:443 |:444 |:21115|:21116|:21119|:3010|:4000' >> "$REPORT" || echo 'no_services_listed' >> "$REPORT"

echo '---skills_count---' >> "$REPORT"
find /root/.hermes/skills /opt/ivoire-monade/palantir/skills -maxdepth 2 -name 'SKILL.md' 2>/dev/null | wc -l >> "$REPORT"

echo '---cron_active---' >> "$REPORT"
cronjob list 2>/dev/null | grep '"name"' | wc -l >> "$REPORT" || echo '0' >> "$REPORT"

# minimal github probe, 1 query, low credit impact
python3 - <<'PY' >> "$REPORT"
import json, subprocess
from urllib.request import Request, urlopen
token = json.loads(subprocess.check_output(['gpg','--quiet','--decrypt','/root/.gpg/github-secrets.json.gpg'], stderr=subprocess.DEVNULL))['github']['pat']
headers = {'Accept':'application/vnd.github.v3+json','Authorization':'token '+token,'User-Agent':'HermesAgent'}
url='https://api.github.com/search/repositories?q=browseros+OR+rustdesk+OR+meshcentral&sort=stars&order=desc&per_page=3'
try:
    data=json.loads(urlopen(Request(url, headers=headers), timeout=20).read())
    for i in data.get('items',[])[:3]:
        print(f"github::{i['full_name']} ★{i['stargazers_count']} {(i.get('description') or '')[:80]}")
except Exception as e:
    print('github_scan_failed='+str(e)[:120])
PY

echo '---report_done---' >> "$REPORT"
cat "$REPORT"
