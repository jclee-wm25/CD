import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { SavedProvider } from './src/contexts/SavedContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SavedProvider>
          <NotificationProvider>
            <StatusBar style="light" />
            <AppNavigator />
          </NotificationProvider>
        </SavedProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
