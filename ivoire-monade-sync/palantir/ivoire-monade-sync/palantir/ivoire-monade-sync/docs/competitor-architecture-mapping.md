# IVOIRE MONADE — Competitive architecture mapping

Date: 2026-07-04
Sources: SANY Global, Caterpillar.com, Cat® Parts Store, MACH architecture article, SCUBE heavy-equipment ecommerce guide.

## 1. What SANY/Cat already do well

- **SANY Global**: product-family landing pages with hero machine, spec callouts, localized service promises, strong CDN imagery.
- **Cat Parts Store**: serial/model lookup first, category taxonomy, planned maintenance kits, reman, diagrams, order history.
- **MACH pattern for spare parts**: separate identification, compatibility, pricing, availability, service content. Frontend should be a read model, not the system of record.
- **Heavy-equipment ecommerce**: RFQ-first, not checkout-first; local pricing, in-stock promise, pickup options, long-cycle nurture.

## 2. Direct mapping to IVOIRE MONADE

| Competitor pattern | IVOIRE MONADE equivalent | Implementation |
|---|---|---|
| Hero product + specs | `/` hero + `CatalogueSection` | Already started |
| Serial/model lookup | `/spare-parts` search by ref or machine | Already scaffolded |
| Category taxonomy | XCMG family filters: U/LC/E/EV/special | `products.ts` tags |
| Compatibility / fitment | machine->parts mapping backend | Next patch |
| Availability freshness | stock backend + MQTT alerts | Planned |
| Request for quote | `/quote` + Telegram+ticket+Calendar | Already spec'd |
| Local pricing promise | FOB Abidjan + 48h quote SLA | Already in branding |
| Maintenance kits / reman | spare-parts kits + options | Next iteration |
| Diagrams / manuals | product documents in `product.documents` | Add in TS schema |

## 3. Metrics we should track

- Part identification success rate
- Self-service order share
- Quote-to-order cycle time
- Support-assisted order volume
- Order accuracy / wrong-part returns
