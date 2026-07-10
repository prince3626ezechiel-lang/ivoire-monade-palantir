# IVOIRE MONADE — Architecture cible
## Engins XCMG + pieces detachees + site e-commerce B2B

## 1. Stack recommande
- Back office ERP/CRM/Commerce : **Odoo ERP** ou alternative open source type **ERPNext**, **Dolibarr**, **InvenTree** pour le catalogue pieces.
- Site vitrine / catalogue : **ivoire-monade.shop**, images 5K fournies par le partenaire.
- Automatisation / Workflow : **Hermes Agent + n8n**.
- Support client : **Formbricks / Zammad** ou formulaire Odoo Website.
- Finance / devis / proforma : module **Sales + Invoicing** Odoo ou Stirling-PDF pour templates.
- Stock / inventaire pieces detachees : **InvenTree** + API REST, puis synchronisation vers Odoo.
- Donnees contractuelles / documents : stockage chiffre GPG, jamais en clair.

## 2. Diagramme de flux
Prospect → Lead → Qualification → Proforma → Devis → Commande → Facture → Support

Source possible :
- Alibaba Qianbao / messages
- Site ivoire-monade.shop / formulaire
- WhatsApp / email / telephone

## 3. Modele de donnees
Voir `/schemas` :
- clients/client.schema.json
- products/product.schema.json
- quotes/proforma.schema.json
- invoices/facture.schema.json
- leads/lead.schema.json
- tickets/ticket.schema.json

## 4. Sechemas / exemples Odoo
- `res.partner` pour clients/partenaires.
- `product.template` / `product.product` pour engins et pieces.
- `sale.order` + `sale.order.template` pour devis/proforma.
- `account.move` pour facture.
- `crm.lead` pour prospects/qualification.

## 5. Securite / Credential management
- Interdiction formelle de tokens en clair.
- GPG-only, via Hermes `secret_store`.
- Credentials uniquement via :
  - `hermes auth add odoo`
  - `hermes auth add whatsapp`
  - `hermes auth add alibaba`
  - `hermes auth add smtp`
  - `hermes auth add sftp_backup`

## 6. Jobs automatises Hermes
- `/cron jobs` :
  - relance devis non acceptes J+3 / J+7
  - verification SLA support
  - backup quotidien schemas + exports
  - veille prix partenaires
