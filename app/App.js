import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/AuthContext';
import ChatScreen from './src/screens/ChatScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { kleuren } from './src/theme';

const Stack = createNativeStackNavigator();

function Schermen() {
  const { gebruiker, laden } = useAuth();

  if (laden) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: kleuren.achtergrond }}>
        <ActivityIndicator size="large" color={kleuren.primair} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerTintColor: kleuren.primair }}>
      {gebruiker ? (
        // Ingelogd. Ticket APP-3: voeg hier een scherm "Gesprekken" toe.
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Assistent' }} />
      ) : (
        <>
          <Stack.Screen name="Inloggen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Registreren" component={RegisterScreen} options={{ title: '' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Schermen />
          <StatusBar style="dark" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
