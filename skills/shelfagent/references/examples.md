# ShelfAgent — Real Interaction Examples

## "I used a can of tuna"

Agent runs:
```bash
python3 shelfagent.py consume "Tuna" 1 --note "lunch"
```
Response: `Done. Canned Tuna 160g — 4.0 -> 3.0. Location: Pantry`

## "I bought 3kg of rice"

Agent runs:
```bash
python3 shelfagent.py replenish "Rice" 3 --note "grocery run"
```
If multiple matches (e.g. "Rice 1kg" + "Rice Arborio 1kg"), shows list and asks which.

## "How much milk do we have?"

Agent runs:
```bash
python3 shelfagent.py search "milk"
```
Response:
```
Results for "milk" (2):
  [ 25] UHT Milk 1L — qty: 2.0pcs @ Pantry
  [ 26] Powdered Milk 1kg — qty: 2.0pcs @ Garage
```

## "Where are the batteries?"

Agent runs:
```bash
python3 shelfagent.py search "battery"
```
Response shows all matches with location.

## "What have we consumed this month?"

Agent runs:
```bash
python3 shelfagent.py history --days 30
```
Response: table with date, action, qty, product, location, note.

## "Shopping list"

Agent runs:
```bash
python3 shelfagent.py shopping-list
```
If empty: "Shopping list is empty."

## "Running low on anything?"

Agent runs:
```bash
python3 shelfagent.py low-stock
```
Shows products where quantity < min_stock.

## User sends photo of groceries

1. Agent calls `vision_analyze`
2. Extracts product list: brand, type, quantity, format
3. Shows list to user:
   ```
   I see:
   1. Canned Tomatoes 400g × 6
   2. Tuna in water 160g × 4
   3. Olive Oil 500ml × 2
   Confirm? Put them all in Pantry?
   ```
4. User confirms → for each product:
   - If exists: `replenish "<name>" <qty> --note "shopping"`
   - If new: `add "<name>" --desc "<desc>" --qty <qty> --loc "Pantry"`
5. Summary: "Added: Canned Tomatoes +6 (5→11). New: Olive Oil 500ml × 2."

## "Add olive oil 500ml in pantry"

Agent runs:
```bash
python3 shelfagent.py add "Olive Oil 500ml" --desc "Extra virgin" --qty 1 --loc "Pantry"
```

## "Inventory" (generic)

Agent runs:
```bash
python3 shelfagent.py stats
python3 shelfagent.py stock
```
Shows summary statistics + full stock grouped by location.

## "Set minimum stock for milk to 2"

Agent runs via direct SQLite:
```bash
sqlite3 ~/sailing/cambusa/cambusa.db "UPDATE products SET min_stock = 2 WHERE LOWER(name) LIKE '%milk%'"
```

## Batch: "I went shopping, add everything"

User dictates list:
- 6 canned tomatoes 400g → Pantry
- 4 tuna in water 160g → Pantry
- 2 olive oil 500ml → Pantry

Agent runs (one command per product):
```bash
python3 shelfagent.py replenish "Canned Tomatoes 400g" 6 --note "shopping"
python3 shelfagent.py replenish "Tuna in water 160g" 4 --note "shopping"
python3 shelfagent.py add "Olive Oil 500ml" --qty 2 --loc "Pantry" --note "shopping"
```
Final summary with all changes.