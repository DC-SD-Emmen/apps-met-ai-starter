// Het chatscherm: het "walking skeleton" van de app.
//
// Werkt al: vraag stellen, antwoord tonen, laden en foutmeldingen.
// Nog niet: gesprekken bewaren. Nu staat alles alleen in het geheugen van
// de app en is het weg als je hem sluit. Dat is ticket APP-2 / APP-3.

import { useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Foutmelding } from '../components';
import { hoek, kleuren, ruimte } from '../theme';

export default function ChatScreen({ navigation }) {
  const { gebruiker, uitloggen } = useAuth();
  const [berichten, setBerichten] = useState([]); // [{ role, content }]
  const [invoer, setInvoer] = useState('');
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);
  const lijst = useRef(null);
  const marges = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={uitloggen} accessibilityRole="button" hitSlop={10}>
          <Text style={{ color: kleuren.primair, fontSize: 16 }}>Uitloggen</Text>
        </Pressable>
      ),
    });
  }, [navigation, uitloggen]);

  async function verstuur() {
    const vraag = invoer.trim();
    if (!vraag || bezig) return;

    const nieuw = [...berichten, { role: 'user', content: vraag }];
    setBerichten(nieuw);
    setInvoer('');
    setFout(null);
    setBezig(true);

    try {
      const antwoord = await api.chat(nieuw);
      setBerichten([...nieuw, antwoord]);
    } catch (e) {
      setFout(e.message);
      setInvoer(vraag); // zodat de gebruiker het opnieuw kan proberen
      setBerichten(berichten);
    } finally {
      setBezig(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={stijl.scherm}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <FlatList
        ref={lijst}
        data={berichten}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={{ padding: ruimte.m, flexGrow: 1 }}
        onContentSizeChange={() => lijst.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={stijl.leeg}>
            <Text style={stijl.leegTitel}>Hoi {gebruiker?.name}!</Text>
            <Text style={stijl.leegTekst}>Stel een vraag om te beginnen.</Text>
          </View>
        }
        renderItem={({ item }) => <Bericht bericht={item} />}
      />

      {bezig && (
        <View style={stijl.typen} accessibilityLiveRegion="polite">
          <ActivityIndicator color={kleuren.primair} />
          <Text style={{ color: kleuren.tekstZacht, marginLeft: ruimte.s }}>De AI denkt na…</Text>
        </View>
      )}

      <View style={{ paddingHorizontal: ruimte.m }}>
        <Foutmelding tekst={fout} />
      </View>

      <View style={[stijl.balk, { paddingBottom: Math.max(marges.bottom, ruimte.s) }]}>
        <TextInput
          style={stijl.invoer}
          value={invoer}
          onChangeText={setInvoer}
          placeholder="Typ je vraag…"
          placeholderTextColor={kleuren.tekstZacht}
          accessibilityLabel="Je vraag"
          multiline
        />
        <Pressable
          onPress={verstuur}
          disabled={!invoer.trim() || bezig}
          accessibilityRole="button"
          accessibilityLabel="Versturen"
          style={[stijl.verstuur, (!invoer.trim() || bezig) && { opacity: 0.4 }]}
        >
          <Text style={{ color: kleuren.opPrimair, fontWeight: '700' }}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bericht({ bericht }) {
  const vanGebruiker = bericht.role === 'user';
  return (
    <View style={[stijl.bericht, vanGebruiker ? stijl.gebruiker : stijl.ai]}>
      {!vanGebruiker && <Text style={stijl.afzender}>AI-antwoord</Text>}
      <Text style={{ color: vanGebruiker ? kleuren.opGebruikerBericht : kleuren.opAiBericht, fontSize: 16 }}>
        {bericht.content}
      </Text>
    </View>
  );
}

const stijl = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: kleuren.achtergrond },
  leeg: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: ruimte.l },
  leegTitel: { fontSize: 22, fontWeight: '700', color: kleuren.tekst },
  leegTekst: { fontSize: 16, color: kleuren.tekstZacht, marginTop: ruimte.s },
  bericht: { maxWidth: '85%', borderRadius: hoek, padding: 12, marginBottom: ruimte.s },
  gebruiker: { alignSelf: 'flex-end', backgroundColor: kleuren.gebruikerBericht },
  ai: { alignSelf: 'flex-start', backgroundColor: kleuren.aiBericht },
  afzender: { fontSize: 12, fontWeight: '700', color: kleuren.opAiBericht, marginBottom: 2, opacity: 0.8 },
  typen: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: ruimte.m, paddingBottom: ruimte.s },
  balk: {
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: ruimte.m, paddingTop: ruimte.s,
    borderTopWidth: 1, borderTopColor: kleuren.rand, backgroundColor: kleuren.achtergrond,
  },
  invoer: {
    flex: 1, maxHeight: 120, borderWidth: 1, borderColor: kleuren.rand, borderRadius: hoek,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, color: kleuren.tekst,
  },
  verstuur: {
    marginLeft: ruimte.s, width: 46, height: 46, borderRadius: 23,
    backgroundColor: kleuren.primair, alignItems: 'center', justifyContent: 'center',
  },
});
