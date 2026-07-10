# IVOIRE MONADE — Workflow OBM Automatise

## Flux standard B2B XCMG
1. **Lead entrant** → qualifiation
   - Sources : site, Alibaba, WhatsApp, email, telephone
   - Donnees : besoin, budget, QTY, timeline

2. **Prospect qualifie** → devis/proforma
   - Selection pieces/engins dans catalogue
   - Prix partenaires
   - Generation PDF proforma
   - Envoi email / WhatsApp

3. **Devis accepte** → commande
   - Creation sale.order
   - Reservation stock
   - Confirmation par email

4. **Commande confirmee** → facture
   - Generation facture finale
   - Export PDF + XML
   - Envoi paiement + documents shipping

5. **Support client**
   - Suivi livraison
   - Tickets apres-vente
   - SLA 24h/48h

## Automatismes Hermes + cron
- `/cron quote follow-up` : relance J+3, J+7, J+14
- `/cron sla checker` : alerte tickets depasses
- `/cron partner price sync` : import prix Alibaba
- `/cron daily backup` : export JSON schemas + DB Odoo

## MCP Tools requis
- MCP Odoo : `sale.order`, `product.product`, `res.partner`
- MCP WhatsApp : envoi proforma + suivi
- MCP Email : SMTP/IMAP via himalaya
- MCP PDF : generation proforma avec branding
- MCP Image : optimisation 5K → webp/avif pour site
