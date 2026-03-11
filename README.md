# Łączy nas piłka – checker wolnych miejsc

Lekki skrypt Node.js: co minutę odpytuje API stadionu i wypisuje sektory z wolnymi miejscami.

## Wymagania

- Node.js 18+ (wbudowany `fetch`)

## Uruchomienie

```bash
node index.js
# lub
yarn start
```

Ciasteczka i token CSRF są zahardkodowane w skrypcie. Gdy sesja wygaśnie, ustaw zmienne środowiskowe:

```bash
COOKIE="..." CSRF_TOKEN="..." node index.js
```

## Zachowanie

- Co **1 minutę** zapytanie GET do API stadionu (mecz PLAL26).
- W logach tylko sektory z `available_seats > 0`.
- Przy braku wolnych miejsc: komunikat „Brak wolnych miejsc”.
