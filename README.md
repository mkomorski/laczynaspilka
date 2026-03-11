# Łączy nas piłka – subskrypcje na wolne miejsca

Aplikacja NestJS z Dockerem i PostgreSQL: zapis subskrybentów na mecz (email lub telefon) i odpytywanie API stadionu co minutę.

## Endpoint

**POST /subscribe**

Body (JSON):

- `matchId` – identyfikator meczu (np. `PLAL26`)
- `email` – adres email **albo**
- `phone` – numer telefonu

Przykład:

```bash
curl -X POST http://localhost:3000/subscribe \
  -H "Content-Type: application/json" \
  -d '{"matchId":"PLAL26","email":"jan@example.com"}'
```

```bash
curl -X POST http://localhost:3000/subscribe \
  -H "Content-Type: application/json" \
  -d '{"matchId":"PLAL26","phone":"+48 123 456 789"}'
```

## Uruchomienie w Dockerze

```bash
docker compose up -d
```

Aplikacja: http://localhost:3000  
Baza: PostgreSQL (port 5432 wewnątrz sieci Docker).

Zmienne środowiskowe (opcjonalnie w `docker-compose.yml` lub `.env`):

- `DATABASE_URL` – URL połączenia z PostgreSQL (w Dockerze ustawiony automatycznie)
- `MATCH_ID` – domyślny mecz do odpytywania (domyślnie `PLAL26`)
- `COOKIE`, `CSRF_TOKEN` – sesja do API bilety.laczynaspilka.pl (domyślnie zahardkodowane)

Przy starcie kontener aplikacji uruchamia `prisma migrate deploy` (stosuje migracje), potem startuje serwer.

## Uruchomienie lokalne (bez Dockera)

Wymagane: Node.js 18+, uruchomiona baza PostgreSQL.

```bash
yarn install
cp .env.example .env   # i ustaw DATABASE_URL
yarn db:push           # lub yarn db:migrate – utwórz schemat w bazie
yarn start:dev
```

Skrypty Prisma: `yarn db:migrate` (migracje w dev), `yarn db:push` (synchronizacja schematu bez migracji), `yarn db:studio` (GUI do bazy).

## Zachowanie

- Co **1 minutę** scheduler odpytuje API stadionu dla `MATCH_ID` i loguje sektory z wolnymi miejscami.
- Subskrybenci zapisani przez POST `/subscribe` są trzymani w tabeli `subscribers` (w przyszłości można dodać powiadomienia email/SMS).
