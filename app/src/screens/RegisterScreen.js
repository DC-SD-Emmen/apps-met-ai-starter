import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useAuth } from '../AuthContext';
import { Foutmelding, Knop, Veld } from '../components';
import { stijl } from './LoginScreen';

export default function RegisterScreen() {
  const { registreren } = useAuth();
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);
  const [velden, setVelden] = useState({});

  async function verstuur() {
    setBezig(true);
    setFout(null);
    setVelden({});
    try {
      await registreren(naam.trim(), email.trim(), wachtwoord);
    } catch (e) {
      setVelden(e.velden ?? {});
      if (!e.velden) setFout(e.message);
      setBezig(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={stijl.scherm} keyboardShouldPersistTaps="handled">
        <Text style={stijl.titel} accessibilityRole="header">Account maken</Text>
        <Foutmelding tekst={fout} />
        <Veld label="Naam" value={naam} onChangeText={setNaam} autoComplete="name" fout={velden.name?.[0]} />
        <Veld label="E-mailadres" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" fout={velden.email?.[0]} />
        <Veld label="Wachtwoord (minimaal 8 tekens)" value={wachtwoord} onChangeText={setWachtwoord} secureTextEntry autoComplete="new-password" fout={velden.password?.[0]} />
        <Knop titel="Registreren" onPress={verstuur} bezig={bezig} uit={!naam || !email || !wachtwoord} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
