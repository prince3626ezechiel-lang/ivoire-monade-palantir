---
id: TER-{{UNIQUE_ID}}
slug: terrain-{{SURFACE_M2}}m2-{{CITY_SLUG}}-{{NEIGHBORHOOD_SLUG}}
title: "Terrain {{SURFACE_M2}} m² — {{CITY}}"
city: {{CITY}}
commune: {{COMMUNE}}
neighborhood: {{NEIGHBORHOOD}}
country: CI
type: {{TYPE}}            # residentiel | commercial | industriel | loisirs | agricole
usage: {{USAGE}}          # construction | commerce | residentiel | hotelier
status: {{STATUS}}        # disponible | reserve | vendu
surface_m2: {{SURFACE_M2}}
surface_unit: m2
price_xof: {{PRICE_XOF}}
price_currency: XOF
price_negotiable: {{PRICE_NEGOTIABLE}}     # true | false
price_ttc: {{PRICE_TTC}}                   # true | false
notary_fees_xof: {{NOTARY_FEES_XOF}}
security_deposit_xof: {{SECURITY_DEPOSIT_XOF}}
title_type: {{TITLE_TYPE}}                 # AD | ACF | AUI
title_number: {{TITLE_NUMBER}}
title_status: {{TITLE_STATUS}}             # verifie | en_attente | conteste
title_document_url: {{TITLE_DOCUMENT_URL}}
cadastral_plan_url: {{CADASTRAL_PLAN_URL}}
urbanization_status: {{URBANIZATION_STATUS}}  # loti | non_loti
utilities: {{UTILITIES}}                   # eau_potable | electricite | egout | voirie_bitumee | fibre
photos:
  - {{PHOTO_1}}
  - {{PHOTO_2}}
drone_video_url: {{DRONE_VIDEO_URL}}
virtual_tour_url: {{VIRTUAL_TOUR_URL}}
description: {{DESCRIPTION}}
features: {{FEATURES}}
latitude: {{LATITUDE}}
longitude: {{LONGITUDE}}
notary_partner_id: {{NOTARY_PARTNER_ID}}
developer_name: {{DEVELOPER_NAME}}
developer_siret: {{DEVELOPER_SIRET}}
commission_ttc: {{COMMISSION_TTC}}
commission_rate: {{COMMISSION_RATE}}
created_at: {{ISO_TIMESTAMP}}
updated_at: {{ISO_TIMESTAMP}}
meta:
  indexed: true
  dispute_free: {{DISPUTE_FREE}}
  url: /terraform/{{SLUG}}
---

# {{TITLE}}

## 🇨🇮 Informations générales

| Champ | Valeur |
|---|---|
| **Localisation** | {{CITY}} — {{COMMUNE}}, {{NEIGHBORHOOD}} |
| **Type** | {{TYPE}} / Usage : {{USAGE}} |
| **Superficie** | {{SURFACE_M2}} m² |
| **Statut** | {{STATUS}} |
| **Urbanisme** | {{URBANIZATION_STATUS}} |

## 💰 Prix

| Champ | Valeur |
|---|---|
| **Prix TTC** | {{PRICE_XOF}} FCFA |
| **Droits de mutation estimés** | {{NOTARY_FEES_XOF}} FCFA |
| **Apport de réservation (séquestre)** | {{SECURITY_DEPOSIT_XOF}} FCFA |
| **Prix négociable** | {{PRICE_NEGOTIABLE}} |

> **Prix indicative.** Le notaire attestera le prix définitif lors de la signature de l’acte authentique.

## 🛡️ Titre foncier

| Champ | Valeur |
|---|---|
| **Type** | {{TITLE_TYPE}} — {{TITLE_STATUS}} |
| **Numéro** | {{TITLE_NUMBER}} |
| **Document officiel** | {{TITLE_DOCUMENT_URL}} |
| **Plan cadastral** | {{CADASTRAL_PLAN_URL}} |

> Badge : {{DISPUTE_FREE ? "✅ Titre non-litigieux attesté" : "⚠️ Vérification en cours"}}

## 🏗️ Caractéristiques & aménagements

{{UTILITIES_LIST}}

## 📈 Simulateur de financement

| Apport | Montant |
|---|---|
| Séquestre | {{SECURITY_DEPOSIT_XOF}} FCFA |
| Frais notaires | {{NOTARY_FEES_XOF}} FCFA |

**Solutions partenaires CI :**
- SGCI, BICICI, NSIA Banque, Orabank
- Mobile Money (Orange Money, Wave, MTN MoMo)

## 📸 Médias

- Galerie : {{PHOTOS_LIST}}
- Vidéo drone : {{DRONE_VIDEO_URL}}
- Visite virtuelle : {{VIRTUAL_TOUR_URL}}

## 🗺️ Localisation

- Google Maps : \`https://maps.google.com/?q={{LATITUDE}},{{LONGITUDE}}\`
- Mapbox intégration : carte interactive embarquée

## ⚖️ Notaire partenaire

| Champ | Valeur |
|---|---|
| **Référence** | {{NOTARY_PARTNER_ID}} |
| **Notaire certifié** | ✅ Vérifié |

### Badges de confiance
- ✅ Titre vérifié ({{TITLE_STATUS}})
- ✅ Notaire partenaire certifié
- ✅ Paiement séquestre notarié
- ✅ Dossier sans litige

## 📞 Contact & réservation

[📲 Réserver via WhatsApp]({{WHATSAPP_LINK}}) | [📅 Planifier visite]({{CALENDAR_LINK}})

> Formulaire ultra-court : nom + WhatsApp + budget + usage → message pré-rempli + ticket CRM + alerte Telegram commercial.

## 📋 Documents joints

- Attestation de non-litige (si applicable)
- Certificat d’urbanisme
- Extrait du plan cadastral
- Conditions générales de vente

---
*Dernière mise à jour : {{ISO_TIMESTAMP}}*  
*Source : base interne promoteur / notaire partenaire (non répertoire public).*
