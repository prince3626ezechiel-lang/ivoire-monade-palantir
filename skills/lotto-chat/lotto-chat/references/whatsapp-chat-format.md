# WhatsApp/Telegram Chat Format — LONACI CI

## Constat session
Les exports WhatsApp/Telegram arrivent souvent
- sans séparation par doubles sauts de ligne,
- avec plusieurs blocs collés dans un même texte,
- parfois avec des lignes orphelines (WIN/MAC sans header explicite si on segmente mal).

## Pattern observé
```text
RÉSULTATS ET MATRICES
DIGITAL 08H 🇮🇪
10-07-2026
WIN:01-21-49-67-65
MAC:44-17-02-33-64

CASH 10H
10-07-2026
...

LONACI 13H
POINTEZ 6 9
POINTEZ 2 3
WHATSAPP +225...

SOLUTION 13H
WIN:39-56-21-18-07
MAC:08-81-30-35-25
```

## Parsing recommandé
1. Segmenter par en-têtes de jeu : `DIGITAL/CASH/SOLUTION/LONACI/WARI` suivi de `\d{1,2}H`.
2. Dans chaque bloc, extraire dans l’ordre :
   - `date` via `\d{2}/\d{2}/\d{4}` ou `\d{2}-\d{2}-\d{4}`
   - `WIN` via `WIN[:\s]+([\d\-\s]+)`
   - `MAC` via `MAC[:\s]+([\d\-\s]+)`
   - `POINTEZ` via `POINT[EÉ]Z\s+(\d+)\s+(\d+)`
   - `contact` via `\+?\d{10,13}`
3. Ne pas exclure `LONACI` quand il n’a pas WIN/MAC dans le bloc : c’est un signal de POINTEZ/contact valide.

## Pièges
- Split par `\n\s*\n` inefficace sur exports monocontinents.
- Les lignes orphelines WIN/MAC en début de texte doivent être rattachées au dernier en-tête reconnu.
- Certains blocs ne contiennent que `POINTEZ` + contact : stocker quand même.
