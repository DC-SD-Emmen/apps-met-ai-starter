import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useAuth } from '../AuthContext';
import { Foutmelding, Knop, Veld } from '../components';
import { kleuren, ruimte } from '../theme';

export default function LoginScreen({ navigation }) {
  const { inloggen } = useAuth();
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);

  async function verstuur() {
    setBezig(true);
    setFout(null);
    try {
      await inloggen(email.trim(), wachtwoord);
      // Na het inloggen wisselt App.js vanzelf naar de schermen voor ingelogde gebruikers.
    } catch (e) {
      setFout(e.velden?.email?.[0] ?? e.message);
      setBezig(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={stijl.scherm} keyboardShouldPersistTaps="handled">
        <Text style={stijl.titel} accessibilityRole="header">Welkom terug</Text>
        <Foutmelding tekst={fout} />
        <Veld label="E-mailadres" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <Veld label="Wachtwoord" value={wachtwoord} onChangeText={setWachtwoord} secureTextEntry autoComplete="password" />
        <Knop titel="Inloggen" onPress={verstuur} bezig={bezig} uit={!email || !wachtwoord} />
        <Pressable onPress={() => navigation.navigate('Registreren')} style={{ marginTop: ruimte.l }} accessibilityRole="link">
          <Text style={stijl.link}>Nog geen account? Registreer hier</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const stijl = StyleSheet.create({
  scherm: { flexGrow: 1, padding: ruimte.l, justifyContent: 'center', backgroundColor: kleuren.achtergrond },
  titel: { fontSize: 28, fontWeight: '700', color: kleuren.tekst, marginBottom: ruimte.m },
  link: { color: kleuren.primair, fontSize: 15, textAlign: 'center', textDecorationLine: 'underline' },
});
