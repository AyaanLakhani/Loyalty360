// src/Providers.jsx
import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }) {
  return (
    <PrivyProvider
      appId="cm8eyfkco0155354sr56dy6z8" // Replace with your actual Privy App ID
      // clientId="your-app-client-id" // Uncomment and replace with your actual Client ID if needed
      config={{
        appearance: {

          loginMethods: ['email', 'wallet', 'phone'],
          theme: 'light',
            
          accentColor: '#676FFF',
          logo: '/360Logo.jpg' // Replace with your actual logo URL
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}  // Closing curly brace added here!
    >
      {children}
    </PrivyProvider>
  );
}
