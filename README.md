# AI-app starter

Startproject voor de leereenheid **React Native & AI** van de opleiding Software Development (DCTerra).

> **Van Bas, lead developer:**
> Welkom in het team! Dit is ons standaard startproject voor AI-apps. Inloggen werkt al, en je kunt al een vraag van je telefoon via onze backend naar de AI-server sturen. Al het werk voor jullie opdrachtgever staat als tickets in [BACKLOG.md](BACKLOG.md). Begin met ticket **ONB-1**: het project bij jezelf werkend krijgen. Succes! 🚀

---

## Wat zit erin?

```
app/   React Native-app (Expo)        → draait op je telefoon met Expo Go
api/   Laravel API (Sanctum)          → draait op je laptop
          │
          └──► AI-server van de opleiding (https://ai-pc.taile10d2b.ts.net/v1)
```

| Werkt al | Bouwen jullie zelf (zie backlog) |
| --- | --- |
| Registreren, inloggen, uitloggen (token in SecureStore) | Gesprekken opslaan in de database |
| Een vraag stellen en antwoord krijgen van de AI | Overzicht van eerdere gesprekken |
| Foutmeldingen bij drukte, time-outs en geen verbinding | De systeemprompt voor jullie opdrachtgever |
| Limiet per gebruiker (10 vragen per minuut) | Huisstijl van jullie opdrachtgever |
| Tests voor inloggen en chat | Verdieping: streaming, vision, RAG of tool calling |

### De gouden regel

**De API-key van de AI-server staat alleen in `api/.env`.** Nooit in de app, nooit in Git. Een app-bestand kan iedereen uitpakken. Daarom praat de app alleen met jullie eigen Laravel API, en die praat met de AI-server.

---

## Aan de slag

### Wat je nodig hebt

- PHP 8.3 of nieuwer en Composer
- Node.js 20 of nieuwer
- De app **Expo Go** op je telefoon (gratis, App Store of Play Store)
- Je **persoonlijke API-key** voor de AI-server (van je docent, begint met `sk-`)

### 1. De API starten

```bash
cd api
composer install
cp .env.example .env          # Windows: copy .env.example .env
php artisan key:generate
php artisan migrate           # maakt database/database.sqlite aan
```

Open `api/.env` en vul je key in:

```
AI_API_KEY=sk-jouw-eigen-key
```

Start de server zo dat je telefoon erbij kan:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Controleer of alles werkt: `php artisan test` moet groen zijn.

### 2. De app starten

Zoek eerst het IP-adres van je laptop in het wifi-netwerk:
- Windows: `ipconfig` → *IPv4-adres*
- macOS: `ipconfig getifaddr en0`

```bash
cd app
npm install
cp .env.example .env          # Windows: copy .env.example .env
```

Zet in `app/.env` het adres van **jullie API** (niet de AI-server):

```
EXPO_PUBLIC_API_URL=http://192.168.1.25:8000/api
```

```bash
npx expo start
```

Scan de QR-code met Expo Go (Android) of met de camera (iPhone). Registreer een account en stel je eerste vraag.

---

## Werkt het niet?

| Wat je ziet | Oorzaak | Oplossing |
| --- | --- | --- |
| *Geen verbinding met de server* in de app | Telefoon kan je laptop niet bereiken | Zelfde wifi? `--host=0.0.0.0` gebruikt? Firewall van je laptop staat poort 8000 toe? |
| Telefoon en laptop vinden elkaar niet op schoolwifi | Het netwerk laat apparaten niet met elkaar praten | Gebruik de Android-emulator (`EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api`) of een hotspot |
| *AI_API_KEY ontbreekt in .env* | Key niet ingevuld | Vul `AI_API_KEY` in `api/.env` in en herstart `php artisan serve` |
| *De API-key van de server klopt niet* | Fout in je key | Kopieer je key opnieuw, zonder spaties of aanhalingstekens |
| *Het is even te druk* | Limiet bereikt | Wacht een minuut |
| Eerste antwoord duurt erg lang | Er wordt een model geladen op de AI-server | Normaal na een modelwissel (20 tot 60 s) |
| Expo Go zegt dat de SDK-versie niet klopt | Je Expo Go is ouder of nieuwer dan het project | Update Expo Go; het project gebruikt Expo SDK 58 |
| `EXPO_PUBLIC_API_URL ontbreekt` | Geen `app/.env` | Doe stap 2 opnieuw en herstart `npx expo start` |

Endpoints testen zonder app? Gebruik Postman of curl:

```bash
curl -X POST http://localhost:8000/api/login -H "Accept: application/json" \
  -H "Content-Type: application/json" -d '{"email":"jij@example.com","password":"..."}'
curl http://localhost:8000/api/ai/status -H "Accept: application/json" -H "Authorization: Bearer <token>"
```

---

## Waar zit wat?

### API (`api/`)

| Bestand | Wat het doet |
| --- | --- |
| `routes/api.php` | Alle endpoints |
| `app/Http/Controllers/AuthController.php` | Registreren, inloggen, uitloggen |
| `app/Http/Controllers/ChatController.php` | Vraag naar de AI sturen, verbinding testen |
| `app/Services/AiService.php` | Praat met de AI-server en vertaalt fouten naar nette meldingen |
| `config/assistent.php` | **De systeemprompt**: hoe de AI zich gedraagt |
| `config/services.php` | Instellingen voor de AI-server (uit `.env`) |
| `app/Providers/AppServiceProvider.php` | Limieten per gebruiker |
| `tests/Feature/` | Tests; de AI-server wordt hier nagebootst met `Http::fake()` |

| Methode | Endpoint | Inloggen nodig |
| --- | --- | --- |
| POST | `/api/register` | nee |
| POST | `/api/login` | nee |
| GET | `/api/me` | ja |
| POST | `/api/logout` | ja |
| GET | `/api/ai/status` | ja |
| POST | `/api/chat` | ja |

### App (`app/`)

| Bestand | Wat het doet |
| --- | --- |
| `App.js` | Navigatie: inlogschermen of app-schermen, afhankelijk van of je bent ingelogd |
| `src/api.js` | Alle verzoeken naar de API, token in SecureStore, foutmeldingen |
| `src/AuthContext.js` | Wie is er ingelogd? Te gebruiken met `useAuth()` |
| `src/screens/` | Inloggen, registreren en chat |
| `src/components.js` | Knop, invoerveld en foutmelding |
| `src/theme.js` | Kleuren en afmetingen: pas dit aan voor jullie opdrachtgever |

---

## Werkafspraken

- Werk in **branches** (`feature/API-2-gesprekken`) en maak een **pull request**. Een teamgenoot reviewt voordat je merget.
- Een ticket is pas klaar als het voldoet aan de *Definition of Done* in [BACKLOG.md](BACKLOG.md).
- Controleer voor elke commit met `git status` dat er geen `.env` tussen staat.
- Geen echte persoonsgegevens, ook niet in testdata.
- Vermeld AI-gebruik in je werk volgens de regels van de opleiding.

Meer over de AI-server (modellen, streaming, vision, embeddings, tool calling): zie de **Studentenhandleiding AI-server SD** en het voorbeeldproject [DCTerra-SD-chat](https://github.com/DC-SD-Emmen/DCTerra-SD-chat).
