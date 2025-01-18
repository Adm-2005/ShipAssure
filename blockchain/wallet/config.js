// src/wallet/config.js
import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains(
  [polygonMumbai], // Using only Mumbai testnet
  [publicProvider()]
)

const { wallets } = getDefaultWallets({
  appName: 'Freight Bidding Platform',
  projectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID, // Using environment variable
  chains
})

const connectors = connectorsForWallets([
  ...wallets,
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export { chains, wagmiConfig }
