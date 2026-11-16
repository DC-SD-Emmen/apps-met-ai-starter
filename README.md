# AI-app starter

Startproject voor de **standaardroute** van de leereenheid **Apps met AI** van de opleiding Software Development (DCTerra).

> **Van Bas, lead developer:**
> Welkom in het team! Dit is ons standaard startproject voor AI-apps. Inloggen werkt al, en je kunt al vanuit de app een vraag via onze backend naar de AI-server sturen. Al het werk voor jullie opdrachtgever staat als tickets in [BACKLOG.md](BACKLOG.md). Begin met ticket **ONB-1**: het project bij jezelf werkend krijgen. Succes! 🚀

---

## Wat zit erin?

```
app/   React Native-app (Expo)        → draait in de Android-emulator
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

## Standaardroute of vrije route?

Dit project is de **standaardstack** van het bureau: React Native (Expo) + Laravel. Past een andere stack beter bij jullie opdrachtgever? Dat mag, als jullie het in week 2 onderbouwen (ticket **ROUTE-1** in de backlog).

| Je kiest | Wat je van dit project gebruikt |
| --- | --- |
| **Standaardroute** | Alles. Volg de stappen hieronder. |
| **Andere app, zelfde backend**<br>(bijv. Flutter, Kotlin, Swift, .NET MAUI, web-app) | Alleen `api/`. Jullie app praat met de endpoints uit [docs/API.md](docs/API.md). |
| **Helemaal eigen stack**<br>(bijv. Node, Python of C# als backend) | Niets, maar wel de afspraken: [docs/API.md](docs/API.md) laat zien wat je backend minimaal moet kunnen. `api/app/Services/AiService.php` is een voorbeeld van de koppeling met de AI-server; die werkt in elke taal hetzelfde. |

Voor iedereen geldt: de API-key staat alleen in de backend, en jullie werken de tickets uit [BACKLOG.md](BACKLOG.md) af, vertaald naar jullie stack.

---

## Aan de slag

### Wat je nodig hebt

- PHP 8.3 of nieuwer en Composer
- Node.js 20 of nieuwer
- **Android Studio** met een Android-emulator (zie hieronder). Op een Mac kan ook de iOS-simulator uit Xcode.
- Je **persoonlijke API-key** voor de AI-server (van je docent, begint met `sk-`)

We werken in deze leereenheid in de **simulator**, niet op je eigen telefoon. Dan werkt het voor iedereen hetzelfde, ook op het schoolnetwerk.

### 0. Eenmalig: de Android-emulator installeren

1. Installeer [Android Studio](https://developer.android.com/studio) en doorloop de installatiewizard met de standaardinstellingen.
2. Open Android Studio → **More Actions → Virtual Device Manager** → **Create Virtual Device**.
3. Kies een toestel (bijvoorbeeld *Pixel 8*) en een systeemimage met de nieuwste Android-versie. Klik **Finish**.
4. Start de emulator met de ▶-knop. Je ziet nu een Android-telefoon op je scherm.
5. Zet de map `platform-tools` in je PATH, zodat Expo de emulator kan vinden:
   - Windows: `%LOCALAPPDATA%\Android\Sdk\platform-tools`
   - macOS: `~/Library/Android/sdk/platform-tools`

   Controleer met `adb devices`: je emulator staat in de lijst.

Expo zet de app **Expo Go** de eerste keer automatisch in de emulator. Die hoef je niet zelf te installeren.

> Heb je een Mac? Dan kun je ook de iOS-simulator gebruiken: installeer Xcode uit de App Store, open hem één keer en druk straks op `i` in plaats van `a`.

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

Start de server en laat dit terminalvenster open:

```bash
php artisan serve
```

Controleer of alles werkt: `php artisan test` moet groen zijn.

### 2. De app starten

Start eerst de emulator (Android Studio → Virtual Device Manager → ▶). Dan, in een **tweede** terminal:

```bash
cd app
npm install
npx expo start
```

Druk op **`a`**. Expo opent de app in de Android-emulator. Registreer een account en stel je eerste vraag.

De app weet zelf hoe hij je Laravel-server bereikt: de Android-emulator gebruikt `http://10.0.2.2:8000/api` (10.0.2.2 is in de emulator het adres van je eigen laptop), de iOS-simulator `http://localhost:8000/api`. Een `.env` in `app/` is dus niet nodig.

**Handig in de emulator:**
- Toetsenbord van je laptop gebruiken: werkt direct in tekstvelden.
- Herladen na een wijziging gaat vanzelf. Lukt dat niet: druk op `r` in de Expo-terminal.
- Testfoto's in de galerij zetten: sleep een afbeelding vanaf je laptop op het emulatorvenster.
- Ander schermformaat testen: maak in de Virtual Device Manager een tweede toestel aan, bijvoorbeeld een klein toestel of een tablet.

---

## Werkt het niet?

| Wat je ziet | Oorzaak | Oplossing |
| --- | --- | --- |
| *Geen verbinding met de server* in de app | Laravel draait niet, of op een andere poort | Draait `php artisan serve` nog? Staat er *port 8000* in de terminal? |
| Op `a` drukken doet niets / *No Android connected device found* | Emulator staat niet aan, of `adb` niet gevonden | Start eerst de emulator. Controleer `adb devices`; anders `platform-tools` aan je PATH toevoegen (stap 0) |
| Emulator start niet of is extreem traag | Virtualisatie staat uit in de BIOS, of te weinig geheugen | Windows: zet *Virtualization* (Intel VT-x / AMD-V) aan in de BIOS en *Windows Hypervisor Platform* aan. Sluit andere zware programma's |
| *AI_API_KEY ontbreekt in .env* | Key niet ingevuld | Vul `AI_API_KEY` in `api/.env` in en herstart `php artisan serve` |
| *De API-key van de server klopt niet* | Fout in je key | Kopieer je key opnieuw, zonder spaties of aanhalingstekens |
| *Het is even te druk* | Limiet bereikt | Wacht een minuut |
| Eerste antwoord duurt erg lang | Er wordt een model geladen op de AI-server | Normaal na een modelwissel (20 tot 60 s) |
| Expo Go in de emulator zegt dat de SDK-versie niet klopt | Er staat een oude Expo Go in de emulator | Verwijder Expo Go uit de emulator (lang indrukken → *App info → Uninstall*) en druk opnieuw op `a` |

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
