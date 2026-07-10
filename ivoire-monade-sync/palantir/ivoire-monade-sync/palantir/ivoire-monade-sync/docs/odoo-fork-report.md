# IVOIRE MONADE — Odoo Fork / Self-Host feasibility report

Date: 2026-07-04
Scope: Odoo 18 evaluation on current host and recommended fork/module strategy.

## 1. Current installation

- **Installed package**: `odoo-18` (Debian/Ubuntu distro build)
- **Package version**: `18.0.0+dfsg-2build1`
- **Python runtime**: `3.11.15` (path: `/usr/bin/python3`)
- **Werkzeug**: `2.0.1`
- **Package source**: distro-provided DEB at `/usr/lib/python3/dist-packages/odoo/`
- **Disk available**: ~138 GB on `/` with 193 GB total
- **RAM available**: 13 GB available, 15 GB total, no swap

## 2. Failing traceback summary

Running `odoo` (entry `/usr/bin/odoo`) raises immediately at import:

```
Traceback (recent call last):
  File "/usr/bin/odoo", line 5, in <module>
    import odoo
  File ".../dist-packages/odoo/__init__.py", line 63, in <module>
    from . import service
  File ".../dist-packages/odoo/service/__init__.py", line 5, in <module>
    from . import model
  File ".../dist-packages/odoo/service/model.py", line 13, in <module>
    from odoo.http import request
  File ".../dist-packages/odoo/http.py", line 281, in <module>
    if parse_version(werkzeug.__version__) >= parse_version('2.0.2'):
AttributeError: module 'werkzeug' has no attribute '__version__'
```

Root cause: Odoo 18’s vendored `http.py` relies on `werkzeug.__version__`, which was removed starting in Werkzeug 2.1+. The distro pin installed `Werkzeug 2.0.1`, where `__version__` is present but apparently not exposed to `odoo` namespace due to import packaging. Even when present, parsing feels brittle. This is a well-known Odoo 18 + newer Werkzeug mismatch.

Practical fix options:
- Pin Werkzeug to `<2.1` via `pip install "Werkzeug<2.1"`
- Or switch to an official Odoo build/tarball with its expected deps
- Best long-term for custom modules: use a git-cloned Odoo 18 enterprise/community repo with a dedicated venv so distro PACKAGE-VS-SOURCE conflicts go away.

## 3. Host constraints

- Disk: comfortable for Odoo + source clone (+~5 GB) plus filestore.
- RAM: 15 GB enough for dev / light prod; Odoo typically uses 1–4 GB depending on workers.
- Swap: `0B` — recommend adding 2–4 GB swap for safety under heavy memory pressure.

## 4. Self-hosted Odoo vs Odoo.sh

Pros of self-hosted fork:
- Full control of modules, branding, packaging, data residency.
- Matches awesome-selfhosted policy for on-prem/self-host.
- Straight-line CI/CD, can ship a custom `xcmg_catalogue` addon family.
- Avoid recurring per-user SaaS fees once infra is amortized.

Cons of self-hosted fork:
- Operational burden: DB backups, workers, reverse proxy, restarts.
- Upstream merges require effort; community packaging drifts.
- Enterprise features require Odoo EE license or separate agreement.

Pros of Odoo.sh:
- Built-in staging/production, CI, backups.
- Managed workers; hot-migrations are safer.

Cons of Odoo.sh:
- You are not fully self-hosted; still a SaaS dependency.
- Cannot ship arbitrary wide-scope patches or pre-load complete ETL/data.
- Custom modules are still possible but tightly gated by Odoo trademark.

Recommended stance for IVOIRE MONADE: self-host from an official Odoo 18 git source, using dockeroized or direct gunicorn/nginx workers. This satisfies both self-hosting requirements and gives edit rights to modules.

## 5. Recommended minimal viable path

1. Clone Odoo 18 community from official repo into `/opt/ivoire-monade/src/odoo`.
2. Create a dedicated venv at `/opt/ivoire-monade/.venvs/odoo18`.
3. Install pinned deps from Odoo’s `requirements.txt` OR use system `python3-odoo` deps but avoid conflicts via venv.
4. Add `/opt/ivoire-monade/odoo-addons/` as an extra addons path.
5. Use a Postgres DB (host or container) and configure `odoo.conf`.
6. Run `odoo-bin -d ivoire -i base --init=xcmg_catalogue --stop-after-init` for migrations.
7. Production later: `odoo-bin` under systemd with 2–4 workers.

## 6. Custom module scaffold

A draft scaffold is scaffolded at `/opt/ivoire-monade/odoo-addons/xcmg_catalogue/` as a proof-of-concept only. Replace MANIFEST / `depends` / data files with real catalog model and views during implementation.
