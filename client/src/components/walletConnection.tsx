import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useChainId } from 'wagmi' // This replaces useNetwork
import { useEffect } from 'react'

const WalletConnection = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  console.log("Connected wallet address:", address)
  console.log("Connected chain ID:", chainId)

  const handleSubmit = async () => {
    try {
      const res = await fetch('/user/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, chainId }),
      })

      if (res.ok) {
        const data = await res.json()
        console.log("Backend response:", data)
      } else {
        console.error("Failed to send data to backend:", res.statusText)
      }
    } catch (error) {
      console.error("Error submitting data to backend:", error)
    }
  }

  useEffect(() => {
    if (isConnected && address && chainId) {
      handleSubmit()
    }
  }, [isConnected, address, chainId])

  return (
    <div className="p-4">
      <ConnectButton 
        chainStatus="icon"
        showBalance={true}
      />

      {isConnected && chainId !== 80001 && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          Please switch to Polygon Mumbai Testnet
        </div>
      )}

      {!isConnected && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          Please connect your wallet to continue
        </div>
      )}
    </div>
  )
}

export default WalletConnection
