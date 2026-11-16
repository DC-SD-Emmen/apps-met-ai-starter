// Houdt bij wie er is ingelogd, zodat elk scherm dat kan gebruiken:
//   const { gebruiker, inloggen, uitloggen } = useAuth();

import { createContext, useContext, useEffect, useState } from 'react';
import { api, token } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [gebruiker, setGebruiker] = useState(null);
  const [laden, setLaden] = useState(true);

  // Bij het opstarten: is er nog een geldig token van de vorige keer?
  useEffect(() => {
    (async () => {
      try {
        if (await token.ophalen()) setGebruiker(await api.ik());
      } catch {
        await token.wissen(); // token verlopen of ingetrokken
      } finally {
        setLaden(false);
      }
    })();
  }, []);

  async function verwerk(resultaat) {
    await token.opslaan(resultaat.token);
    setGebruiker(resultaat.user);
  }

  const waarde = {
    gebruiker,
    laden,
    inloggen: async (email, wachtwoord) => verwerk(await api.inloggen(email, wachtwoord)),
    registreren: async (naam, email, wachtwoord) => verwerk(await api.registreren(naam, email, wachtwoord)),
    uitloggen: async () => {
      try {
        await api.uitloggen();
      } finally {
        await token.wissen();
        setGebruiker(null);
      }
    },
  };

  return <AuthContext.Provider value={waarde}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
