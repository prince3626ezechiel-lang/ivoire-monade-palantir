# ShelfAgent — Command Reference

All commands are subcommands of `shelfagent.py`.
Default DB path: `~/sailing/cambusa/cambusa.db` (override: `SHELFAGENT_DB` env var).

## consume

Log consumption of N units (decrement stock + write transaction).

```bash
python3 shelfagent.py consume <product> <qty> [--note "<note>"]
```

- Match: exact case-insensitive → partial (contains) → numeric ID
- If multiple matches: shows list and asks to specify
- If quantity goes below zero: warns but proceeds (intentional)

Examples:
```bash
python3 shelfagent.py consume "Canned Tuna 160g" 1 --note "lunch"
python3 shelfagent.py consume "Rice" 2 --note "dinner"
python3 shelfagent.py consume 35 1 --note "snack"  # by ID
```

## replenish

Log restock of N units (increment stock + write transaction).

```bash
python3 shelfagent.py replenish <product> <qty> [--note "<note>"]
```

Examples:
```bash
python3 shelfagent.py replenish "Rice 1kg" 3 --note "grocery run"
python3 shelfagent.py replenish "AA Batteries" 8 --note "online order"
```

## stock

Show current stock, grouped by location.

```bash
python3 shelfagent.py stock [--category <category>]
```

Output: `[ID] Name — qty: Nunit (min: M) [category]`, grouped by location.

## history

Transaction history, ordered by date DESC.

```bash
python3 shelfagent.py history [--days <N>] [--product "<name>"] [--limit <N>]
```

- `--days N`: last N days
- `--product "name"`: filter by product (partial match)
- `--limit N`: result limit (default 50)

Action types: `consume`, `replenish`, `adjust`, `import`.

## shopping-list

Show items to buy (fulfilled = 0).

```bash
python3 shelfagent.py shopping-list
```

## fulfill

Mark a shopping list item as bought.

```bash
python3 shelfagent.py fulfill <product>
```

## search

Search products by name or description (partial match case-insensitive).

```bash
python3 shelfagent.py search "<text>"
```

## low-stock

Show products where `quantity < min_stock`.

```bash
python3 shelfagent.py low-stock
```

Requires `min_stock` to have been set (via `add --min N` or direct SQLite).

## add

Add a new product to the catalog + stock.

```bash
python3 shelfagent.py add "<name>" [--desc "<desc>"] [--qty <N>] [--loc "<location>"] [--cat "<category>"] [--unit "<unit>"] [--min <min_stock>]
```

- If `--loc` doesn't exist, it's created automatically
- If `--cat` omitted, default: pantry
- If `--loc` omitted, uses first available location or creates "Default"
- Categories: pantry, spare-parts, tools, cleaning, personal-care, electronics

Example:
```bash
python3 shelfagent.py add "Olive Oil 500ml" --desc "Extra virgin" --qty 2 --loc "Pantry" --cat pantry --unit pcs --min 1
```

## locations

List all locations with product count and total quantity.

```bash
python3 shelfagent.py locations
```

## categories

List all categories with product count.

```bash
python3 shelfagent.py categories
```

## set-category

Change a product's category.

```bash
python3 shelfagent.py set-category <product> <category>
```

## export

Export the entire DB as JSON (to stdout).

```bash
python3 shelfagent.py export > backup.json
```

## import-homebox

Import products from Homebox via API (localhost:3100).
Skips products that already exist (name match, case-insensitive).

```bash
python3 shelfagent.py import-homebox
```

Requires credentials in `~/.hermes/.homebox-creds`.

## stats

Summary statistics: total products, total quantity, locations, transactions
(consume/replenish/import), low-stock items, top 5 consumed.

```bash
python3 shelfagent.py stats
```