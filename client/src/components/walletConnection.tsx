import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useEffect } from 'react';
import { polygonAmoy } from 'wagmi/chains';

const WalletConnection = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const handleSubmit = async () => {
    try {
      const res = await fetch('/user/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          chainId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Backend response:', data);
      } else {
        console.error('Failed to send data to backend:', res.statusText);
      }
    } catch (error) {
      console.error('Error submitting data to backend:', error);
    }
  };

  useEffect(() => {
    if (isConnected && address && chainId) {
      handleSubmit();
    }
  }, [isConnected, address, chainId]);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <ConnectButton />

        {isConnected && chainId !== 80002 && (
          <button
            onClick={() => switchChain({ chainId: polygonAmoy.id })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Switch to Polygon Amoy
          </button>
        )}

        {!isConnected && (
          <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
            Please connect your wallet to continue
          </div>
        )}
      </div>
    </>
  );
};

export default WalletConnection;
