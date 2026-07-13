---
name: zero-to-live-site
version: 1.0.0
description: Go from idea to a live, HTTPS-secured website in under an hour — single HTML frontend, Python/Flask backend, nginx reverse proxy, systemd service. No build tools, no CI/CD, just ship.
trigger: When user wants to deploy a new website, spin up a quick prototype, or make a local HTML page accessible via public URL.
---

# 🚀 Zero to Live Site

## What you'll get

A live website at `https://yourdomain.com/path/` in under 1 hour:
- **Frontend**: Single HTML file (no build tools, no framework lock-in)
- **Backend**: Python/Flask API server managed by systemd
- **Proxy**: nginx reverse proxy with SSL
- **Monitoring**: auto-restart, health checks

## The pattern

### Step 1: HTML file
Create a single `index.html` in your site directory:
```bash
mkdir -p /home/ubuntu/sites/myapp && cd /home/ubuntu/sites/myapp
# Write your HTML, CSS, JS all in one file
```

**Key insight**: Start with a single file. You can always split later. The fastest path to "works" is one file.

### Step 2: Python backend (if needed)
```bash
# server.py — Flask app with your API
nano server.py
```

### Step 3: systemd service
```bash
sudo tee /etc/systemd/system/myapp.service << 'SERVICEEOF'
[Unit]
Description=My App
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/sites/myapp
ExecStart=/usr/bin/python3.12 server.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICEEOF

sudo systemctl daemon-reload
sudo systemctl enable --now myapp.service
```

### Step 4: nginx config
```nginx
location /myapp {
    alias /home/ubuntu/sites/myapp;
    index index.html;
}
# OR for API proxy:
location /api/myapp {
    proxy_pass http://127.0.0.1:XXXX;
    proxy_set_header Host $host;
}
```

### Step 5: Verify
```bash
# Test nginx
sudo nginx -t && sudo systemctl reload nginx

# Check port/HTTP
curl -sI https://yourdomain.com/myapp/
```

## ⚠️ Pitfalls we learned the hard way

### File permissions
- `chmod 644` for static files, `chmod 755` for directories
- **If nginx returns 403** when the file exists → it's a permission problem. Nginx runs as `www-data`.
- After `write_file`, always check: `chmod 644 /path/to/file`

### nginx alias vs root
- `alias` replaces the matched path prefix with the directory
- `root` appends the full path to the directory
- **Common mistake**: `alias /path/` without trailing slash in location — leads to weird path concatenation
- **Safe pattern**: `location /path { alias /real/path; index index.html; }`

### Port conflicts
- Before starting a Python server: `ss -tlnp | grep ':PORT'`
- If port is in use: kill the old process or use a different port
- **Orphan processes** from previous tests are the #1 cause of "Address already in use"

### Python development server warning
- Flask dev server prints "WARNING: Do not use in production" — ignore it for MVP
- Add `use_reloader=False` to prevent double-fork issues with systemd
- For real production, add gunicorn later. Don't let "production-ready" delay shipping.

### systemd restart loops
- After crash, systemd restarts aggressively → 13374+ restart attempts in one night
- **Fix**: `sudo systemctl reset-failed myapp.service` after fixing the root cause
- Always check `systemctl status myapp.service` for restart count

## Real example

In production we run 15+ services this pattern:
- `app-api` (port 8100) — main business API
- `divination-api` (port 8090) — divination engine  
- `deduction-api` (port 8113) — data deduction service
- `assistant-api` (port 8096) — assistant service
- Each is: a Python Flask app + systemd unit + nginx location block
