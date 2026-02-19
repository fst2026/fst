# Fanatic Speed Team - Next.js

Strona wydarzenia motoryzacyjnego `Fanatic Summer Car Show` z:

- zakładkami informacyjnymi,
- formularzem zgłoszeń pojazdu (upload min. 3 zdjęć),
- panelem admina do akceptacji/odrzucania,
- eksportem zgłoszeń do CSV (otwieralny w Excelu),
- opcjonalnym formularzem kontaktowym.

## UI

- Interfejs jest zbudowany na gotowych komponentach `react-bootstrap`.
- Style biblioteki są ładowane globalnie (`bootstrap/dist/css/bootstrap.min.css`).

## Backend MVP (production-ready)

- Dane są zapisywane w PostgreSQL (`DATABASE_URL`).
- Zdjęcia są wysyłane do storage S3/R2 (lub lokalnie jako fallback).
- Logowanie admina:
  - OAuth przez GitHub (`next-auth`),
  - allowlista adresów e-mail (`ADMIN_EMAILS`),
  - middleware chroniące panel i API admina.
- Maile transakcyjne:
  - po wysłaniu zgłoszenia (`pending`),
  - po akceptacji (`accepted`, dane do przelewu + deadline),
  - po odrzuceniu (`rejected`, zaproszenie + mapa parkingu).

## Uruchomienie

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj zmienne środowiskowe:

```bash
cp .env.example .env.local
```

Nigdy nie commituj `.env.local`; po deployu trzymaj sekrety wyłącznie w env hostingu (Vercel).

3. Uruchom:

```bash
npm run dev
```

## Setup Neon + R2 + Auth (zalecany)

1. Neon:
- utwórz projekt i skopiuj `DATABASE_URL`.
- wpisz `DATABASE_URL` do `.env.local`.
- zalecane: ustaw `sslmode=verify-full` w `DATABASE_URL`.

2. R2:
- utwórz bucket w Cloudflare R2.
- wygeneruj klucze API S3 dla R2.
- uzupełnij pola `R2_*` w `.env.local`.

3. GitHub OAuth (admin panel):
- utwórz OAuth App w GitHub,
- ustaw callback URL: `http://localhost:3000/api/auth/callback/github` (dev),
- ustaw callback URL produkcyjny: `https://twoja-domena/api/auth/callback/github`,
- uzupełnij: `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`,
- ustaw `ADMIN_EMAILS` jako listę adresów oddzielonych przecinkami.

4. Sprawdź połączenie z bazą:

```bash
npm run db:check
```

5. Start:

```bash
npm run dev
```

## Ważne ścieżki

- Strona główna: `/`
- Zgłoszenie pojazdu: `/zglos-pojazd`
- Kontakt: `/kontakt`
- Panel admina: `/admin`

## Logika zgłoszeń

- Dane zgłoszeń zapisują się do tabeli `submissions` w PostgreSQL.
- Upload zdjęć zapisuje pliki do S3/R2 (przy braku konfiguracji: `public/uploads`).
- Na Vercel bez R2/S3 upload nie jest trwale zapisywany (ustaw `DISABLE_IMAGE_UPLOAD=true`).
- Statusy zgłoszeń: `pending`, `accepted`, `rejected`.
- Eksport CSV dostępny z panelu admina.
- Limity zdjęć: min 3, max 5, max 5 MB / plik.

## E-mail potwierdzający (opcjonalnie)

Jeżeli ustawisz `SMTP_*` w `.env.local`, system wyśle maile statusowe.
