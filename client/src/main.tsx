import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { WagmiProvider, http } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { router } from './utils/config';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'ShipAssure',
  projectId: '42b65b6e50dadf5df8fb5b105cd4144e',
  chains: [polygonAmoy, polygon],
  transports: {
    [polygonAmoy.id]: http(),
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

const Main = () => {
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
