// Alle communicatie met jullie Laravel API loopt via dit bestand.
//
// De app praat NOOIT rechtstreeks met de AI-server: de API-key zou dan
// in de app staan, en een app-bestand kan iedereen uitpakken.

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// We werken in de simulator. Die bereikt de Laravel-server op je laptop via:
//   Android-emulator: 10.0.2.2 (betekent "de computer waarop de emulator draait")
//   iOS-simulator (alleen op een Mac): localhost
// Ander adres nodig? Zet EXPO_PUBLIC_API_URL in app/.env (zie .env.example).
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://localhost:8000/api');
const TOKEN_SLEUTEL = 'auth_token';
const TIMEOUT_MS = 100_000; // AI-antwoorden kunnen even duren

// --- Token veilig bewaren op het toestel --------------------------------

export const token = {
  ophalen: () => SecureStore.getItemAsync(TOKEN_SLEUTEL),
  opslaan: (waarde) => SecureStore.setItemAsync(TOKEN_SLEUTEL, waarde),
  wissen: () => SecureStore.deleteItemAsync(TOKEN_SLEUTEL),
};

// --- Eén plek voor alle verzoeken -----------------------------------------

export class ApiFout extends Error {
  constructor(melding, status, velden = {}) {
    super(melding);
    this.status = status;
    this.velden = velden; // validatiefouten per veld, bijv. { email: ['...'] }
  }
}

async function verzoek(methode, pad, body) {
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
  const opgeslagenToken = await token.ophalen();
  if (opgeslagenToken) headers.Authorization = `Bearer ${opgeslagenToken}`;

  const afbreken = new AbortController();
  const timer = setTimeout(() => afbreken.abort(), TIMEOUT_MS);

  let antwoord;
  try {
    antwoord = await fetch(`${API_URL}${pad}`, {
      method: methode,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: afbreken.signal,
    });
  } catch (e) {
    throw new ApiFout(
      e.name === 'AbortError'
        ? 'Het duurde te lang. Probeer het opnieuw.'
        : `Geen verbinding met de server (${API_URL}). Draait php artisan serve op poort 8000?`,
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  const data = await antwoord.json().catch(() => ({}));

  if (!antwoord.ok) {
    const meldingen = {
      401: 'Je bent niet (meer) ingelogd.',
      429: 'Het is even te druk. Wacht een minuut en probeer het opnieuw.',
    };
    throw new ApiFout(
      data.message || meldingen[antwoord.status] || `Er ging iets mis (fout ${antwoord.status}).`,
      antwoord.status,
      data.errors,
    );
  }

  return data;
}

// --- De endpoints van jullie API ------------------------------------------

export const api = {
  registreren: (name, email, password) => verzoek('POST', '/register', { name, email, password }),
  inloggen: (email, password) => verzoek('POST', '/login', { email, password }),
  uitloggen: () => verzoek('POST', '/logout'),
  ik: () => verzoek('GET', '/me'),
  aiStatus: () => verzoek('GET', '/ai/status'),

  // berichten: [{ role: 'user' | 'assistant', content: '...' }, ...]
  chat: (berichten) => verzoek('POST', '/chat', { berichten }),

  // Ticket APP-2 / APP-3: endpoints voor gesprekken komen hier.
};
