# Templates WhatsApp — Immobilier foncier CI

Contexte : flux closing WhatsApp-first adapté de XCMG/grands comptes CI.  
Chaque message est un template prêt à coller, avec variables entre `{{ }}` et emoji par défaut.

---

## 1️⃣ Accusé réception automatique (dès soumission formulaire)

**Objectif** : confirmer réception + ancrer le rendez-vous.

> **🎯 Votre demande de réservation est bien reçue !**  
> Bonjour {{Prenom}},  
> Merci pour votre intérêt pour :  
> 🏡 **{{Terrain}}** — {{Ville}}, {{Commune}}  
> 📐 {{Surface}} m² — 💰 {{Prix}} FCFA  
>  
> ✅ Votre ticket commercial est créé (#{{TicketID}}).  
> 📅 Je vous propose un créneau : {{DateProposition}}  
> Voulez-vous que je vous envoie la vidéo drone + plans HD ?  
> —  
> 🟢 Réponse **Oui** → je vous envoie tout de suite  
> 🟡 **Autre créneau** → proposez-moi une date/heure  
> 🔴 **Pas dispo** → on rappelle dans 48h  
>  
> _Immobilier CI — Titre vérifié, notaire partenaire certifié_

---

## 2️⃣ Message commercial 1 (proposition de valeur immédiate)

**Objectif** : envoyer photos + vidéo + visio sans délai.

> **📸 Photos HD + vidéo drone — {{Terrain}}**  
> Bonjour {{Prenom}},  
> Voici votre pack complet :  
> 📂 Photos HD : {{LienGalerie}}  
> 🎥 Vidéo drone : {{LienDrone}}  
> 🗺️ Plan cadastral + titre foncier : {{LienTitre}}  
> 💰 Simulation financement (SGCI / BICICI / NSIA) : {{LienSimu}}  
>  
> ✅ **Titre foncier {{TypeTitre}} vérifié**  
> ✅ **Notaire partenaire certifié**  
> ✅ **Séquestre notarié sécurisé**  
>  
> 📅 On planifie la visite virtuelle ou sur site ?  
> _Répondez à ce message — je réponds en 15 min_

---

## 3️⃣ Relance 48h (si pas de réponse)

**Objectif** : créer urgence douce + comparer.

> **⏰ Toujours intéressé par ce terrain ?**  
> Bonjour {{Prenom}},  
> Je reviens vers vous pour :  
> 🏡 **{{Terrain}} — {{Prix}} FCFA**  
>  
> 📊 **Comparatif disponible :**  
> • Terrain similaire à {{VilleB}} — {{PrixB}} FCFA  
> • Financement possible {{Duree}} mois — {{Mensualite}} FCFA/mois  
> • Séquestre : {{Sequestre}} FCFA (pas 100% à débourser d’avance)  
>  
> ⚠️ **Ce terrain est réservable 7 jours.**  
>  
> 🟢 **Oui je réserve** → apport séquestre  
> 🟡 **Je compare d’abord** → envoie-moi vos critères  
> 🔴 **Pas intéressé** → désinscrit-moi proprement  
>  
> _Promoteur CI certifié_

---

## 4️⃣ Closing pré-contrat (engagement)

**Objectif** : faire signer l’offre de réservation / pré-contrat.

> **📝 Offre de réservation — {{Terrain}}**  
> Bonjour {{Prenom}},  
> Merci de valider :  
> 🏡 **Terrain :** {{Terrain}}  
> 👤 **Acheteur :** {{NomClient}}  
> 💰 **Prix convenu :** {{Prix}} FCFA TTC  
> 💳 **Séquestre à verser sous 48h :** {{Sequestre}} FCFA  
> 📅 **Acte notarié prévu :** {{DateNotaire}}  
>  
> 📄 Documents à préparer :  
> • CNI {{Client}}  
> • Attestation emploi / revenu (pour financement)  
>  
> 🟢 **J’accepte l’offre** → je vous envoie les coordonnées notaire + lien séquestre  
> 🟡 **J’ai une question** → répondez à ce message  
>  
> _En validant, vous réservez le terrain 48h._  
> _Notaire partenaire : {{NotaireRef}}_

---

## 5️⃣ Notification séquestre / notaire (post-closing)

**Objectif** : guider vers paiement sécurisé + alerte équipe.

> **🔐 Séquestre notarié — Prochaines étapes**  
> Bonjour {{Prenom}},  
> Vous avez réservé **{{Terrain}}**. Excellent choix.  
>  
> 📋 **Prochaines étapes :**  
> 1️⃣ **Séquestre notarié** : {{Sequestre}} FCFA → {{LienPaiementSecurise}}  
> 2️⃣ **Rendez-vous notaire** : {{DateNotaire}} — {{LieuNotaire}}  
> 3️⃣ **Dossier titre foncier** : suivi par {{NotaireRef}}  
> 4️⃣ **Financement bancaire** (si besoin) : {{LienDemandeFinancement}}  
>  
> 🏦 **Banques partenaires :** SGCI · BICICI · NSIA · Orabank  
> 📱 **Mobile Money :** Orange Money · Wave · MTN MoMo  
>  
> Besoin d’aide pour monter le dossier ? Je vous accompagne.  
> _Ticket #{{TicketID}} — Commercial : {{CommercialName}}_

---

## 6️⃣ Relance administratif (suivi dossier)

**Objectif** : rappeler check-list + motiver action.

> **📂 Où en est votre dossier terrain ?**  
> Bonjour {{Prenom}},  
> Dernière mise à jour :  
> ✅ Séquestre versé : {{DateSequestre}}  
> ✅ Rendez-vous notaire confirmé : {{DateNotaire}}  
> ⏳ Titre foncier en cours de mutation  
> ⏳ Permis de construire (si construction)  
>  
> **À fournir de votre côté :**  
> • CNI recto/verso  
> • Justificatif de domicile  
> • Attestation de revenu  
>  
> 🟢 **Tout transmis** → je vérifie et vous confirme  
> 🟡 **J’ai un document manquant** → dites-moi lequel  
>  
> _Délai estimé acte notarié : {{DureeActe}} jours._

---

## 7️⃣ Message post-acte (thank you + upsell)

**Objectif** : fidéliser + cross-sell construction.

> **🎉 Félicitations ! Devenu propriétaire foncier**  
> Bonjour {{Prenom}},  
> Acte notarié enregistré — bienvenue dans la communauté propriétaires CI.  
>  
> 🏗️ **Projet de construction ?**  
> • Plans architectes + permis de construire  
> • Partenaires artisans certifiés (maçon, électricien, plombier)  
> • Financement construction (SGCI / BICICI)  
>  
> 💡 **Votre prochain terrain ?**  
> Programme VIP : avant-première terrains disponibles → WhatsApp premium  
>  
> ⭐ **Évaluez votre expérience :**  
> 🟢 Parfait  
> 🟡 Peut mieux faire  
> 🔴 Insatisfait  
>  
> _Merci pour votre confiance._

---

## 8️⃣ Abandon / désinscription (opt-out poli)

**Objectif** : fermer proprement + collecter feedback.

> **🙏 On respecte votre choix.**  
> Vous êtes bien désinscrit des alertes terrains **CI**.  
>  
> Pourquoi ? (optionnel)  
> 🔹 Trop cher — 🔹 Pas le bon secteur — 🔹 Timing  
> 🔹 Autre : ___________  
>  
> On revient vers vous dans 3 mois avec des offres adaptées.  
> À bientôt.  
> _Immobilier CI_

---

## 📋 HashMap des variables

| Variable | Exemple |
|---|---|
| `{{Prenom}}` | Jean |
| `{{NomClient}}` | Kouassi Jean |
| `{{Terrain}}` | Terrain 500m² Deux Plateaux Cocody |
| `{{Ville}}` | Abidjan |
| `{{Commune}}` | Cocody |
| `{{Neighborhood}}` | Deux Plateaux |
| `{{Surface}}` | 500 |
| `{{Prix}}` | 45 000 000 FCFA |
| `{{Sequestre}}` | 2 250 000 FCFA |
| `{{NotaryFees}}` | 2 700 000 FCFA |
| `{{TypeTitre}}` | ACF |
| `{{TicketID}}` | TR-20260704-001 |
| `{{DateNotaire}}` | 18 juillet 2026 |
| `{{LienPaiementSecurise}}` | https://notaire.ci/pay/TR-001 |
| `{{NotaireRef}}` | NOT-Cocody-003 |
| `{{CommercialName}}` | Amani Koné |
| `{{Mensualite}}` | 450 000 |
| `{{Duree}}` | 120 |

---

## 📌 Règles d’usage

1. **Temps de réponse cible** : < 15 min commercial / < 5 min accuser réception auto  
2. **Relance 48h** : maximum 2 relances puis passage en cold outreach trimestriel  
3. **Opt-out** : systématique + respect RGPD/LCEN CI  
4. **Tone** : proche, direct, francophone CI sans jargon  
5. **CTA** : toujours un choix 2-3 options (Oui / Autre / Non)  
6. **Trust** : toujours rappeler titre vérifié + notaire partenaire + paiement sécurisé
