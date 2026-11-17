# Backlog

Zet deze tickets op jullie sprintbord (bijvoorbeeld GitHub Projects). Verdeel ze in het team en werk ze af in de volgorde van de sprints. Tickets met **(verdieping)** kies je passend bij jullie opdrachtgever.

Kiezen jullie de **vrije route**? Dan gelden dezelfde tickets, vertaald naar jullie stack. `php artisan test` wordt dan de testopdracht van jullie eigen backend, `src/theme.js` het stijlbestand van jullie app, enzovoort.

## Definition of Done

Een ticket is klaar als:

- [ ] de code in een pull request staat en door een teamgenoot is gereviewd;
- [ ] de backend-tests groen zijn (standaardroute: `php artisan test`), met tests voor nieuwe endpoints;
- [ ] de app werkt in de emulator, simulator of browser die jullie gebruiken;
- [ ] foutsituaties netjes worden afgevangen (geen crash, wel een begrijpelijke melding);
- [ ] er geen API-key of `.env` in Git staat.

---

## Week 2 · Alleen voor de vrije route

### ROUTE-1 · Keuzeonderbouwing
Leg op maximaal één A4 vast:
- welke stack jullie kiezen (app en backend);
- waarom die beter past bij de opdrachtgever en de gebruiker;
- wat jullie al kunnen en wat jullie nog moeten leren;
- de risico's en hoe jullie die opvangen;
- hoe jullie voldoen aan de vaste eisen: AI-server via eigen backend, key alleen in de backend, Git met pull requests, dezelfde basiseisen.
- **Klaar als:** de docent de onderbouwing heeft goedgekeurd bij de sprintplanning.

---

## Sprint 1 · week 3 – 4 · Onboarding en de AI in jullie hand

### ONB-1 · Project draaien
Krijg API en app werkend volgens de README. Iedereen in het team doet dit op de eigen laptop.
*Vrije route:* zet jullie eigen project op met inloggen en één AI-vraag via de backend, volgens [docs/API.md](docs/API.md).
- **Klaar als:** je kunt in de emulator inloggen, een vraag stellen en een antwoord krijgen. `GET /api/ai/status` geeft in Postman de beschikbare modellen.

### ONB-2 · Code lezen
Volg één vraag van het chatscherm tot de AI-server en terug. Teken de route: welke bestanden en functies komen voorbij?
- **Klaar als:** de tekening staat in jullie ontwerpdocument en iedereen kan hem uitleggen.

### API-1 · Systeemprompt voor de opdrachtgever
Pas `config/assistent.php` aan op basis van de intake. Wie is de gebruiker, wat mag de AI wel en niet, welk taalniveau?
- **Klaar als:** jullie de prompt getest hebben met minimaal 5 vragen, waaronder 2 "lastige" (iets wat de AI niet mag doen). Resultaten staan in het testrapport.

### APP-1 · Huisstijl van de opdrachtgever
Pas `src/theme.js`, de app-naam en het icoon (`app.json`, `assets/`) aan.
- **Klaar als:** de kleuren voldoende contrast hebben (minimaal WCAG AA) en de opdrachtgever het heeft gezien.

---

## Sprint 2 · week 5 – 6 · Gesprekken bewaren

### API-2 · Database voor gesprekken
Maak migrations en models voor `Conversation` (gebruiker, titel) en `Message` (gesprek, role, content). Leg de relaties vast (`User` heeft veel `Conversation`s, `Conversation` heeft veel `Message`s).
- **Klaar als:** `php artisan migrate:fresh` werkt en de relaties getest zijn.

### API-3 · Endpoints voor gesprekken
| Methode | Endpoint | Wat |
| --- | --- | --- |
| GET | `/api/gesprekken` | Eigen gesprekken, nieuwste eerst |
| POST | `/api/gesprekken` | Nieuw gesprek |
| GET | `/api/gesprekken/{id}` | Eén gesprek met alle berichten |
| POST | `/api/gesprekken/{id}/berichten` | Vraag opslaan → AI vragen (geschiedenis uit de database) → antwoord opslaan en teruggeven |
| DELETE | `/api/gesprekken/{id}` | Gesprek verwijderen |

- **Klaar als:** een gebruiker alleen bij de eigen gesprekken kan (gebruik een Policy) en er tests zijn die dat aantonen. Gebruik `AiService::chat()`; de throttle `ai` blijft op het berichten-endpoint.

### APP-2 · API-functies in de app
Voeg de nieuwe endpoints toe aan `src/api.js`.

### APP-3 · Gesprekkenscherm
Een scherm met een `FlatList` van eerdere gesprekken, een knop *Nieuw gesprek* en navigatie naar het chatscherm. Het chatscherm laadt en bewaart berichten via de API in plaats van in het geheugen.
- **Klaar als:** je de app kunt sluiten en openen en je gesprekken er nog zijn.

---

## Sprint 3 · week 7 – 8 · Verdieping, testen en kwaliteit

Kies **minstens één** verdieping die past bij jullie opdrachtgever.

### VD-1 · Streaming (verdieping) — *Oefencliënt*
Laat het antwoord woord voor woord verschijnen. Laravel stuurt Server-Sent Events door (`stream: true` richting de AI-server, `response()->stream()` richting de app). In de app lees je de stream met `fetch` uit `expo/fetch`.
- Voorbeeld van de logica: `app.py` in DCTerra-SD-chat.

### VD-2 · Foto's laten lezen (verdieping) — *Plantendokter, Brievenhulp*
Foto kiezen met `expo-image-picker` (`launchImageLibraryAsync` met `base64: true`, verklein de foto eerst). In de emulator zet je testfoto's in de galerij door ze vanaf je laptop op het emulatorvenster te slepen, meesturen naar Laravel en daar als `image_url` naar `qwen3.6:35b` sturen met `reasoning_effort: "none"`. Pas de validatie van `content` aan.
- **Let op:** alleen voorbeeldfoto's en voorbeeldbrieven, nooit iets met echte persoonsgegevens. Vision-tests in de afgesproken tijdsblokken.

### VD-3 · Antwoorden uit eigen documenten (verdieping) — *Webshop-assistent*
Zet de FAQ van de opdrachtgever om naar embeddings met `bge-m3` (sla ze op in de database) en geef bij elke vraag de best passende stukken mee aan het taalmodel (RAG).

### VD-4 · Tool calling (verdieping) — *Webshop-assistent*
Laat de AI een functie `bestelstatus(bestelnummer)` aanroepen die jullie API uitvoert. De functie geeft alleen bestellingen van de ingelogde gebruiker terug.

### TEST-1 · Testrapport
- Feature tests voor alle endpoints (inclusief: andermans gesprek opvragen moet mislukken).
- **Prompttest:** 10 vragen die een echte gebruiker zou stellen, plus 3 pogingen om de AI iets te laten doen wat niet mag. Beoordeel elk antwoord (goed / matig / fout) en noteer wat je aanpast.
- Testplan voor de app: wat gebeurt er zonder internet, bij een verlopen token, bij een heel lange vraag?

### KWAL-1 · Toegankelijkheid en verantwoord AI-gebruik
Grotere tekst (systeeminstelling) breekt de layout niet, knoppen hebben `accessibilityLabel`s, en de app laat duidelijk zien dat antwoorden van AI komen en fouten kunnen bevatten.

---

## Week 9 · Afronden en opleveren

Begin van de week verbeteren en documenteren, eind van de week opleveren.

### KWAL-2 · Verbetervoorstellen
Maak op basis van het testrapport en de feedback van de opdrachtgever een lijst met verbetervoorstellen, geprioriteerd. Voer de belangrijkste door.

### DOC-1 · README voor de opdrachtgever
Pas deze README aan voor jullie eigen app: wat doet hij, hoe installeer je hem, welke keuzes hebben jullie gemaakt?

### OPL-1 · Opleveren
Demo bij de opdrachtgever, presentatie aan de klas en reflectie. Zie de handleiding van de leereenheid.
