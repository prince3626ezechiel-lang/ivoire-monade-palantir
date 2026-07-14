---
name: topic-monitor
description: Proactive topic monitoring with weighted scoring, rate limits, digests, and Hermes cron delivery.
tags:
  - monitoring
  - research
  - cron
  - web-search
  - alerts
  - proactive
---

# Topic Monitor

Topic Monitor stores configuration in `~/.hermes/topic-monitor/config.json`, environment values in `~/.hermes/topic-monitor/.env`, seen-finding dedupe state in `~/.hermes/topic-monitor/data/seen_findings.json`, alert history in `~/.hermes/topic-monitor/data/alert_history.jsonl`, and daily rate-limit counters in `~/.hermes/topic-monitor/data/state.json`.

## Requirements

- Python 3.8+
- Hermes Agent with `hermes cron`
- `web-search-plus` installed at `~/.hermes/plugins/web-search-plus/search.py` or available through `WEB_SEARCH_PLUS_PATH`

See `references/web-search-plus-integration.md` for known bugs, provider routing notes, and integration details.
- At least one configured provider key: `SERPER_API_KEY`, `TAVILY_API_KEY`, or `EXA_API_KEY`

## Setup

Interactive onboarding:

```bash
python3 scripts/setup.py
```

Quick one-line topic creation:

```bash
python3 scripts/quick.py "AI Safety" --frequency daily --importance MEDIUM
```

Manual topic creation:

```bash
python3 scripts/manage_topics.py add \
  --name "AI Safety" \
  --query '"AI safety" OR alignment OR evals' \
  --keywords 'policy,evaluation,benchmark,-clickbait' \
  --frequency daily \
  --importance-threshold MEDIUM \
  --channels telegram \
  --context "Track meaningful policy, eval, and incident changes." \
  --alert-on 'model_release,critical_cve,product_launch' \
  --ignore-sources 'example.com' \
  --boost-sources 'openai.com,anthropic.com'
```

## Scoring Model

Each finding gets a weighted float score from `0.0` to `1.0`:

- `keyword_match`: `0.3`
- `freshness`: `0.2`
- `source_quality`: `0.2`
- `alert_conditions`: `0.3`

Thresholds:

- `HIGH`: `>= 0.8`
- `MEDIUM`: `>= 0.6`
- `LOW`: `>= 0.4`

### Signal Classes

Before sending alerts, classify every finding. This is the main noise-control layer.

- `must_alert`: official changelogs, security advisories, critical CVEs, zero-days, pricing/terms changes, breaking API changes, major model releases, acquisitions, product launches that match `alert_on`.
- `digest_only`: opinion pieces, tutorials, benchmarks without a concrete release, repeated launch coverage, social reactions, newsletters, and low-urgency analysis.
- `ignore`: SEO farms, thin reposts, duplicate syndicated articles, sales pages without new information, unrelated keyword collisions, or anything matching negative keywords.

Delivery rule: `must_alert` can trigger immediate delivery if it passes threshold and rate limits. `digest_only` should be stored for the next digest unless explicitly requested. `ignore` should be deduped/stored only if useful for feedback debugging.

### Source Trust Tiers

Use source trust alongside `boost_sources`; don't rely on keyword density alone.

- `tier_1`: official docs, vendor blogs, GitHub releases/issues, security advisories, standards bodies, package registries. Strong boost and high confidence.
- `tier_2`: respected technical publications, analyst blogs, known domain experts, reputable newsletters. Moderate boost.
- `tier_3`: forums, social media, aggregators, reposts, scraped news, unknown blogs. No boost unless corroborated by Tier 1/2.

If a Tier 1 source has low keyword density but clearly matches a topic's intent, prefer it over a noisy Tier 3 item with many keywords.

### Alert Message Shape

Every delivered alert should answer these five points:

- **What changed:** one sentence, concrete.
- **Why it matters:** impact for Robby/Hermi/projects.
- **Recommended action:** watch, read, update, patch, ignore, or escalate.
- **Confidence:** high/medium/low with source reason.
- **Dedupe note:** new source, update to existing story, or repeated coverage.

Avoid sending naked link dumps. If the monitor cannot explain why the item matters, it belongs in a digest, not an alert.

### Keyword Syntax

- Standard keywords increase the keyword-match component.
- Negative keywords use a leading `-`, for example `-clickbait`.
- If a finding contains a negative keyword in its title or snippet, its score becomes `0.0` immediately.

### Alert Conditions

Valid `alert_on` condition names:

- `model_release`
- `price_change`
- `patch_version`
- `critical_cve`
- `zero_day`
- `funding_round`
- `acquisition`
- `product_launch`

`price_change` only triggers when the detected percentage is greater than `10%`.

### Source Controls

- `ignore_sources`: domains skipped entirely
- `boost_sources`: domains that receive a `+0.3` source-quality bonus

## Rate Limiting, Quiet Hours, And Fatigue Control

- `max_alerts_per_day` limits all findings recorded in a UTC day
- `max_alerts_per_topic_per_day` limits findings per topic per UTC day
- `quiet_hours` uses `{"start":"HH:MM","end":"HH:MM"}`
- During quiet hours, findings are still written to history but are not emitted for delivery

Recommended fatigue controls for future script upgrades:

- Per-domain cooldown: don't alert repeatedly from the same source unless score increases materially.
- Semantic cluster cooldown: group near-duplicates by normalized title/domain/story and suppress repeats.
- Score improvement gate: alert repeated stories only if new score is at least `+0.15` above the last sent item.
- Weekly suppressed-items summary: show what was muted so tuning remains visible.
- Feedback log: append `useful`, `too_noisy`, `duplicate`, `too_late`, or `missed` ratings to `data/feedback.jsonl` and use it to tune weights.

## Frequency Filtering

Use `monitor.py --frequency` to split cron schedules:

- `python3 scripts/monitor.py --frequency hourly`
- `python3 scripts/monitor.py --frequency daily`
- `python3 scripts/monitor.py --frequency weekly`

## Agent Chronicle Feedback Loop

Topic Monitor should feed Agent Chronicle only when an alert has narrative value, not for every RSS burp.

Good Chronicle candidates:

- A monitored topic changed Robby's/Hermi's priorities.
- A repeated external signal became a real project thread.
- A major source contradicted an existing assumption.
- A watch item graduated into an action, skill patch, cron, or memory proposal.

Chronicle can also feed Topic Monitor: recurring diary questions in `curiosity.md` or `threads.md` can become new monitored topics, but only when they need external change detection. Don't monitor static curiosities; that is how cron gardens become weed farms.

Hourly topics only run when `--frequency hourly` is passed.

## Hermes Cron Examples

Hourly topics:

```bash
hermes cron add topic-monitor-hourly "0 * * * *" "cd /home/hermes/hermes-topic-monitor && python3 scripts/monitor.py --frequency hourly"
```

Daily topics:

```bash
hermes cron add topic-monitor-daily "0 9 * * *" "cd /home/hermes/hermes-topic-monitor && python3 scripts/monitor.py --frequency daily"
```

Weekly digest:

```bash
hermes cron add topic-monitor-digest "0 9 * * 1" "cd /home/hermes/hermes-topic-monitor && python3 scripts/digest.py --days 7"
```

## Commands

- `python3 scripts/manage_topics.py list`
- `python3 scripts/manage_topics.py add ...`
- `python3 scripts/manage_topics.py edit <topic-id> ...`
- `python3 scripts/manage_topics.py remove <topic-id>`
- `python3 scripts/manage_topics.py test <topic-id> --limit 5`
- `python3 scripts/quick.py "Topic Name" --frequency daily --importance MEDIUM`
- `python3 scripts/setup.py`
- `python3 scripts/monitor.py --dry-run --verbose --frequency hourly`
- `python3 scripts/digest.py --days 7`
