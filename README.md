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

## Powiadomienia SMS (JustSend)

Przy **zmianie** wolnych miejsc (nowy sektor lub inna liczba) skrypt może wysłać SMS przez [JustSend API v3](https://justsend.pl/static/files/justsend-api-v3.pdf).

Zmienne środowiskowe:

- **`JUSTSEND_APP_KEY`** – klucz API z panelu JustSend (nagłówek `appKey`).
- **`NOTIFY_PHONES`** – numery do powiadomień, po przecinku, np. `48123456789,48500100200`.

Przykład:

```bash
JUSTSEND_APP_KEY=twój_klucz NOTIFY_PHONES=48123456789 node index.js
```

SMS jest wysyłany tylko gdy pojawi się zmiana (nie przy każdym pollu z tym samym stanem).

## Zachowanie

- Co **1 minutę** zapytanie GET do API stadionu (mecz PLAL26).
- W logach tylko sektory z wolnymi miejscami przy **zmianie** (bez dublowania).
- Przy braku wolnych miejsc: komunikat „Brak wolnych miejsc”.
- Gdy jest ustawione `JUSTSEND_APP_KEY` i `NOTIFY_PHONES` – wysyłka SMS przy zmianie.
