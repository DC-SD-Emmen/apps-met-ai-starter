// Kleine bouwstenen die op meerdere schermen terugkomen.

import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { hoek, kleuren, ruimte } from './theme';

export function Knop({ titel, onPress, bezig = false, uit = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: uit || bezig, busy: bezig }}
      onPress={onPress}
      disabled={uit || bezig}
      style={({ pressed }) => [stijl.knop, (uit || bezig) && { opacity: 0.5 }, pressed && { opacity: 0.8 }]}
    >
      {bezig ? <ActivityIndicator color={kleuren.opPrimair} /> : <Text style={stijl.knopTekst}>{titel}</Text>}
    </Pressable>
  );
}

export function Veld({ label, fout, ...props }) {
  return (
    <>
      <Text style={stijl.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={kleuren.tekstZacht}
        style={[stijl.veld, fout && { borderColor: kleuren.fout }]}
        {...props}
      />
      {fout ? <Text style={stijl.fout}>{fout}</Text> : null}
    </>
  );
}

export function Foutmelding({ tekst }) {
  if (!tekst) return null;
  return (
    <Text accessibilityRole="alert" style={[stijl.fout, { marginBottom: ruimte.m }]}>
      {tekst}
    </Text>
  );
}

const stijl = StyleSheet.create({
  knop: {
    backgroundColor: kleuren.primair,
    borderRadius: hoek,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: ruimte.s,
  },
  knopTekst: { color: kleuren.opPrimair, fontSize: 16, fontWeight: '600' },
  label: { color: kleuren.tekst, fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: ruimte.m },
  veld: {
    borderWidth: 1,
    borderColor: kleuren.rand,
    borderRadius: hoek,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: kleuren.tekst,
    backgroundColor: kleuren.achtergrond,
  },
  fout: { color: kleuren.fout, fontSize: 14, marginTop: 4 },
});
