#!/usr/bin/env python3
"""
LONACI CI lottery parser + scorer.
Input : text blocks from WhatsApp/Telegram/Gmail (RÉSULTATS ET MATRICES format)
Output : JSONL records + stats + recommendation
"""
import re, json, hashlib, sys
from datetime import datetime, timezone
from pathlib import Path
from collections import Counter, defaultdict

RAW_DIR = Path("/root/.hermes/lonaci/raw")
OUT_DIR = Path("/root/.hermes/lonaci/data")
OUT_DIR.mkdir(parents=True, exist_ok=True)

GAMES = ["DIGITAL", "CASH", "SOLUTION", "LONACI", "WARI"]

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def _joinitems(vals):
    return ",".join(str(x) for x in vals)

def make_id(record):
    raw = f"{record.get('date','')}-{record.get('game','')}-{_joinitems(record.get('win',[]))}-{_joinitems(record.get('mac',[]))}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

PATTERNS = {
    "date": re.compile(r"(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})"),
    "win": re.compile(r"WIN[:\s]+([\d\-\s]+)"),
    "mac": re.compile(r"MAC[:\s]+([\d\-\s]+)"),
    "pointz": re.compile(r"POINT[EÉ]Z\s+(\d+)\s+(\d+)", re.IGNORECASE),
    "game_header": re.compile(r"\b(" + "|".join(GAMES) + r")\s*(\d{1,2}H)?", re.IGNORECASE),
    "wa": re.compile(r"\+?\d{10,13}"),
}

def parse_block(text: str, source: str = "unknown"):
    text = text.replace("\r", "")
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    record = {
        "id": None,
        "source": source,
        "game": None,
        "date": None,
        "win": [],
        "mac": [],
        "pointz": [],
        "contact": None,
        "ts": now_iso(),
    }

    for line in lines[:5]:
        m = PATTERNS["game_header"].search(line)
        if m:
            record["game"] = m.group(1).upper()
            break

    for line in lines:
        m = PATTERNS["date"].search(line)
        if m:
            record["date"] = m.group(1).replace(".", "-")
            break

    for line in lines:
        m = PATTERNS["win"].search(line)
        if m:
            record["win"] = [int(x) for x in re.findall(r"\d+", m.group(1))]
        m = PATTERNS["mac"].search(line)
        if m:
            record["mac"] = [int(x) for x in re.findall(r"\d+", m.group(1))]

    for line in lines:
        m = PATTERNS["pointz"].search(line)
        if m:
            record["pointz"] = [int(m.group(1)), int(m.group(2))]

    for line in lines:
        m = PATTERNS["wa"].search(line)
        if m:
            record["contact"] = m.group(0)
            break

    if record["win"] and record["mac"] and record["date"]:
        record["id"] = make_id(record)
        return record
    return None

def write_record(record):
    date_str = record.get("date", "unknown").replace("-", "").replace("/", "")
    path = OUT_DIR / f"results_{date_str}.jsonl"
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    return path

def load_all():
    records = []
    for p in OUT_DIR.glob("results_*.jsonl"):
        with open(p, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    records.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return records

def score_records(records):
    freq_win = Counter()
    freq_mac = Counter()
    by_game = defaultdict(list)
    for r in records:
        by_game[r.get("game", "UNKNOWN")].append(r)
        for d in r.get("win", []):
            freq_win[int(str(d)[-1])] += 1
        for d in r.get("mac", []):
            freq_mac[int(str(d)[-1])] += 1
    return {
        "total_records": len(records),
        "games_covered": sorted({r.get("game") for r in records}),
        "top_win_digits": freq_win.most_common(10),
        "top_mac_digits": freq_mac.most_common(10),
        "records_per_game": {g: len(v) for g, v in by_game.items()},
    }

def recommend_today(records, top_n=5):
    by_game = defaultdict(list)
    for r in records:
        by_game[r.get("game", "UNKNOWN")].append(r)
    ranked = []
    for game, items in by_game.items():
        win_sets = [set(r.get("win", [])) for r in items]
        mac_sets = [set(r.get("mac", [])) for r in items]
        overlaps = [len(w & m) for w, m in zip(win_sets, mac_sets)]
        avg_overlap = sum(overlaps) / max(1, len(overlaps))
        ranked.append((len(items), avg_overlap, game, items[-1] if items else None))
    ranked.sort(reverse=True)
    picks = []
    for count, overlap, game, last in ranked[:top_n]:
        picks.append({
            "game": game,
            "records": count,
            "avg_overlap": round(avg_overlap, 3),
            "last_win": last.get("win", []) if last else [],
            "last_mac": last.get("mac", []) if last else [],
            "recommendation": "JOUE" if count >= 3 and overlap >= 1.5 else "OBSERVE",
        })
    return picks

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: lonaci_parser.py <text_file> [source]")
        sys.exit(0)

    src = sys.argv[2] if len(sys.argv) > 2 else "cli"
    text = Path(sys.argv[1]).read_text(encoding="utf-8")
    header_pat = re.compile(r"\b(?:DIGITAL|CASH|SOLUTION|LONACI|WARI)\b\s*\d{1,2}H?", re.IGNORECASE)
    spans = list(header_pat.finditer(text))
    if not spans:
        blocks = [text.strip()]
    else:
        blocks = []
        for i, m in enumerate(spans):
            start = m.start()
            end = spans[i + 1].start() if i + 1 < len(spans) else len(text)
            blocks.append(text[start:end].strip())

    saved = []
    for block in blocks:
        if len(block.strip()) < 10:
            continue
        rec = parse_block(block, source=src)
        if rec:
            saved.append(rec)
            write_record(rec)

    print(f"Saved {len(saved)} records")
    for rec in saved:
        print(f"- {rec['game']} | {rec['date']} | WIN {rec['win']} | MAC {rec['mac']} -> {OUT_DIR}")

    all_recs = load_all()
    stats = score_records(all_recs)
    print("\n=== STATS ===")
    print(json.dumps(stats, ensure_ascii=False, indent=2))

    picks = recommend_today(all_recs)
    print("\n=== RECOMMENDATION ===")
    print(json.dumps(picks, ensure_ascii=False, indent=2))
