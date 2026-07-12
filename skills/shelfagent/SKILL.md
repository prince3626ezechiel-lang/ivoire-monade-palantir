---
name: shelfagent
description: >-
  Use when managing inventory (provisions, spare parts, tools, supplies) via SQLite.
  Triggers: inventory, stock, "I used X", "I bought X", "how much X do we have",
  "where is X", shopping list, low stock, restock, consume, replenish.
version: 1.0.0
author: Y2K Sailing
license: MIT
metadata:
  hermes:
    tags: [inventory, stock, supplies, provisions, spare-parts, shopping-list]
    related_skills: []
    config:
      - key: shelfagent.db_path
        description: "Path to the SQLite database"
        prompt: "Where do you want to store the inventory database?"
        default: "~/sailing/cambusa/cambusa.db"
      - key: shelfagent.script_path
        description: "Path to the shelfagent.py script"
        prompt: "Where is shelfagent.py located?"
        default: "~/sailing/cambusa/cambusa.py"
---

# ShelfAgent — Inventory Management via SQLite

## Overview

Custom SQLite database for managing any inventory — provisions, spare parts, tools,
cleaning supplies, electronics, personal care items. Tracks full transaction history
(every consume/replenish is logged with timestamp and notes), generates shopping lists,
and alerts on low stock.

**Database:** `~/sailing/cambusa/cambusa.db`
**Script:** `~/sailing/cambusa/cambusa.py`
**Zero dependencies** — only Python 3 + SQLite (stdlib only).

## When to Use

- User says "inventory", "stock", "what do we have"
- User says "I used X", "I ate X", "consumed X" → `consume`
- User says "I bought X", "restocked X", "added X" → `replenish`
- User asks "how much X do we have?", "where is X?" → `search`
- User says "shopping list" → `shopping-list`
- User asks "what have we used?" → `history`
- User says "low stock" or "running low" → `low-stock`
- User sends a photo of groceries → vision_analyze → confirm → `add` or `replenish`

Don't use for: non-inventory queries. Those have their own skills.

## RULES

1. **Autonomous access** — when the user says "consume X" or "add X", execute immediately.
   Don't ask permission for obvious actions (eating one = -1, buying 3 = +3).
2. **Always live DB** — every operation calls shelfagent.py. Never answer from memory.
3. **No confirmations for obvious actions** — decrement, increment, search. Ask only if
   ambiguous (multiple matches, unclear name).
4. **Notes are valuable** — if the user says "for dinner", add `--note "dinner"`. Context matters.

## Commands

All commands are subcommands of `shelfagent.py`. Default DB path is
`~/sailing/cambusa/cambusa.db` (override via `SHELFAGENT_DB` env var).

```bash
SCRIPT=~/sailing/cambusa/cambusa.py
```

### Consume (used/eaten)

```bash
python3 $SCRIPT consume "<product>" <qty> --note "<note>"
```

Match: exact case-insensitive → partial (contains) → numeric ID.
If multiple matches, shows list and asks to specify.

### Replenish (bought/received)

```bash
python3 $SCRIPT replenish "<product>" <qty> --note "<note>"
```

### Add new product

```bash
python3 $SCRIPT add "<name>" --desc "<desc>" --qty <N> --loc "<location>" --cat "<category>" --unit "<unit>" --min <min_stock>
```

Categories: pantry, spare-parts, tools, cleaning, personal-care, electronics.
If `--loc` doesn't exist, it's created automatically. If `--cat` omitted, default: pantry.

### Search

```bash
python3 $SCRIPT search "<text>"
```

Searches name + description, partial match case-insensitive.

### Full stock

```bash
python3 $SCRIPT stock                     # everything
python3 $SCRIPT stock --category pantry    # filtered
```

Grouped by location, with product ID, quantity, unit, min stock.

### Transaction history

```bash
python3 $SCRIPT history                     # all
python3 $SCRIPT history --days 30            # last 30 days
python3 $SCRIPT history --product "tuna"     # filtered by product
```

### Shopping list

```bash
python3 $SCRIPT shopping-list
python3 $SCRIPT fulfill "<product>"         # mark as bought
```

### Low stock

```bash
python3 $SCRIPT low-stock
```

### Stats

```bash
python3 $SCRIPT stats
```

### Locations and categories

```bash
python3 $SCRIPT locations
python3 $SCRIPT categories
```

### Export (JSON backup)

```bash
python3 $SCRIPT export > backup.json
```

## Interaction Map

| User says | Agent executes |
|-----------|----------------|
| "I used a can of tuna" | `consume "Tuna" 1 --note "lunch"` |
| "I bought 3kg of rice" | `replenish "Rice" 3 --note "grocery run"` |
| "how much milk do we have?" | `search "milk"` |
| "where are the batteries?" | `search "battery"` |
| "what have we consumed this month?" | `history --days 30` |
| "shopping list" | `shopping-list` |
| "running low on anything?" | `low-stock` |
| "add olive oil 500ml in pantry" | `add "Olive Oil 500ml" --loc "Pantry" --qty 1` |
| "inventory" (generic) | `stats` + `stock` |
| photo of groceries | `vision_analyze` → confirm → batch `add`/`replenish` |

## Photo → Vision → ShelfAgent

1. **vision_analyze** with configured vision model
2. Extract product list: brand, type, quantity, format
3. **Show user** for confirmation — never write without approval
4. If approved: for each product
   - If exists → `replenish "<name>" <qty> --note "shopping"`
   - If new → `add "<name>" --desc "<desc>" --qty <qty> --loc "<location>"`
5. Summary report

## Database Schema

| Table | Purpose |
|-------|---------|
| `products` | Catalog: name, description, category, unit, min stock, barcode |
| `locations` | Physical places: pantry, garage, workshop, etc. |
| `stock` | Current quantity per product + location |
| `transactions` | Full history: consume/replenish/adjust/import with timestamps |
| `shopping_list` | Items to buy, with fulfilled flag |

6 default categories: pantry, spare-parts, tools, cleaning, personal-care, electronics.

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/spidgrou/shelfagent.git

# 2. Copy the skill
cp -r shelfagent/hermes-skill ~/.hermes/skills/shelfagent

# 3. Initialize the database
sqlite3 ~/sailing/cambusa/cambusa.db < shelfagent/src/schema.sql

# 4. (Optional) Import from Homebox
python3 shelfagent/src/shelfagent.py import-homebox

# 5. Verify
python3 shelfagent/src/shelfagent.py stats
```

## Common Pitfalls

1. **Multiple matches** — if `consume "pasta"` finds 5 products, the script shows the list
   and asks to specify. Use the exact name or the ID.

2. **Negative stock** — `consume` doesn't block if quantity goes below zero (warns only).
   This is intentional: sometimes you consume before logging the purchase.

3. **Inconsistent units** — if a product was in "pcs" and you replenish in "kg", the script
   doesn't convert. Keep units consistent per product.

4. **Migration from Homebox** — transaction history is NOT imported (Homebox doesn't track it).
   You start from zero with transactions.

5. **DB path** — if you move the DB, update `SHELFAGENT_DB` env var or the default in the script.

## Verification Checklist

- [ ] `shelfagent.py` executable and reachable
- [ ] `cambusa.db` initialized with `schema.sql`
- [ ] `stats` shows products and locations
- [ ] `consume` + `history` verify transactions are being recorded
- [ ] `search` finds products via partial match
- [ ] `low-stock` works after setting `min_stock`