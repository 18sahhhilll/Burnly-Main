import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { VentureProvider } from './context/VentureContext.jsx';
import { ScenarioProvider } from './context/ScenarioContext.jsx';
import { AppRouter } from './routes/AppRouter.jsx';

export default function App() {
  return (
    <AuthProvider>
      <VentureProvider>
        <ScenarioProvider>
          <AppRouter />
        </ScenarioProvider>
      </VentureProvider>
    </AuthProvider>
  );
}
