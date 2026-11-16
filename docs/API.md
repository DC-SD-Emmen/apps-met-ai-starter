# API-afspraken

Dit is het contract tussen de app en de backend. De Laravel-API in `api/` werkt al zo. Bouw je een **andere app** (Flutter, Kotlin, Swift, .NET MAUI, web-app), dan praat die met deze endpoints. Bouw je een **eigen backend**, dan laat je die minimaal hetzelfde doen.

Alle verzoeken en antwoorden zijn JSON. Stuur altijd mee:

```
Accept: application/json
Content-Type: application/json
```

Basisadres tijdens het ontwikkelen:

| Waar draait de app? | Adres van de backend |
| --- | --- |
| Android-emulator | `http://10.0.2.2:8000/api` |
| iOS-simulator of browser op dezelfde laptop | `http://localhost:8000/api` |

---

## Inloggen

### `POST /register`

```json
{ "name": "Yara", "email": "yara@example.com", "password": "minimaal8tekens" }
```

**201 Created**

```json
{
  "user": { "id": 1, "name": "Yara", "email": "yara@example.com" },
  "token": "1|abc..."
}
```

### `POST /login`

```json
{ "email": "yara@example.com", "password": "minimaal8tekens" }
```

**200 OK**: zelfde vorm als bij registreren.

Bewaar het `token` veilig op het toestel (SecureStore, Keychain, EncryptedSharedPreferences…) en stuur het mee bij alle andere verzoeken:

```
Authorization: Bearer 1|abc...
```

### `GET /me`

Geeft de ingelogde gebruiker terug.

### `POST /logout`

Trekt het token van dit apparaat in.

---

## AI

### `GET /ai/status`

Test of de backend de AI-server kan bereiken.

```json
{ "verbonden": true, "model": "gpt-oss:20b", "beschikbare_modellen": ["gpt-oss:20b", "qwen3.6:35b", "bge-m3"] }
```

### `POST /chat`

Stuur het gesprek tot nu toe mee, oudste bericht eerst. Alleen de rollen `user` en `assistant` zijn toegestaan: de systeemprompt bepaalt de backend, niet de app.

```json
{
  "berichten": [
    { "role": "user", "content": "Mijn plant heeft gele bladeren." }
  ]
}
```

**200 OK**

```json
{ "role": "assistant", "content": "Gele bladeren kunnen komen door..." }
```

Maximaal 10 vragen per minuut per gebruiker.

---

## Fouten

Bij een fout krijg je altijd een `message` die je zo aan de gebruiker kunt laten zien.

| Status | Betekenis | Voorbeeld |
| --- | --- | --- |
| 401 | Niet (meer) ingelogd | `{ "message": "Unauthenticated." }` |
| 422 | Ongeldige invoer; per veld in `errors` | `{ "message": "...", "errors": { "email": ["E-mailadres of wachtwoord klopt niet."] } }` |
| 429 | Te veel vragen of AI-server druk | `{ "message": "Het is even te druk. Wacht een minuut en probeer het opnieuw." }` |
| 500 | Backend verkeerd ingesteld (bijv. geen key) | `{ "message": "De AI-server is niet ingesteld: AI_API_KEY ontbreekt in .env." }` |
| 502 / 503 | AI-server gaf een fout of is niet bereikbaar | `{ "message": "De AI-server is nu niet bereikbaar. Probeer het over een minuut opnieuw." }` |

Een AI-antwoord kan tot ongeveer een minuut duren. Zet de time-out in je app dus ruim (bijvoorbeeld 100 seconden) en laat een laadindicator zien.

---

## Nog te bouwen (backlog)

De endpoints voor gesprekken (`/gesprekken`, ticket **API-3**) staan beschreven in [BACKLOG.md](../BACKLOG.md). Voeg ze hier toe zodra jullie ze gebouwd hebben: dit document is jullie afspraak tussen app en backend.
