import React, { useEffect, useState } from 'react';
import { fetchBidIdsByShipper, fetchBidData } from '../components/fetchBidData';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

// Define interfaces for the data structures
interface Location {
  locationName: string;
}

interface Bid {
  shipper: string;
  price: bigint;
  shipmentDetails: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  cargoType: string;
  estimatedDeliveryDate: number;
  actualDeliveryDate?: number;
  finalPrice: bigint;
}

const BidDetailsPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [inputAddress, setInputAddress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchBids = async (walletAddress: string): Promise<void> => {
    try {
      const bidIds: string[] = await fetchBidIdsByShipper(walletAddress);
      const bidDetails: (Bid | null)[] = await Promise.all(bidIds.map((bidId) => fetchBidData(Number(bidId))));
      setBids(bidDetails.filter((bid): bid is Bid => bid !== null));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to fetch bids. Please check the wallet address.');
      setBids([]);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      // Automatically fetch bids for the connected wallet
      fetchBids(address);
    }
  }, [isConnected, address]);

  const handleAddressSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (ethers.isAddress(inputAddress)) {
      fetchBids(inputAddress);
    } else {
      setErrorMessage('Invalid wallet address.');
    }
  };

  const handleBidClick = (bid: Bid): void => {
    setSelectedBid(bid);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bid Details</h1>

      {!isConnected ? (
        <p className="text-gray-600">Please connect your wallet to view your bids.</p>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Bids by Wallet Address</h2>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter wallet address"
              value={inputAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputAddress(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      )}

      {bids.length === 0 && !errorMessage && (
        <p className="text-gray-600">Loading or no bids available for this wallet address.</p>
      )}

      <div className="space-y-4">
        {bids.map((bid, index) => (
          <div 
            key={index} 
            onClick={() => handleBidClick(bid)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <p>
              <strong>Bid ID:</strong> {index + 1}
            </p>
            <p>
              <strong>Price:</strong>{' '}
              {ethers.formatUnits(bid.price, 'ether')} ETH
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {bid.actualDeliveryDate ? 'Completed' : 'In Progress'}
            </p>
          </div>
        ))}
      </div>

      {selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Bid Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Shipper:</strong> {selectedBid.shipper}
              </p>
              <p>
                <strong>Price:</strong>{' '}
                {ethers.formatUnits(selectedBid.price, 'ether')} ETH
              </p>
              <p>
                <strong>Shipment Details:</strong> {selectedBid.shipmentDetails}
              </p>
              <p>
                <strong>Pickup Location:</strong>{' '}
                {selectedBid.pickupLocation.locationName}
              </p>
              <p>
                <strong>Delivery Location:</strong>{' '}
                {selectedBid.deliveryLocation.locationName}
              </p>
              <p>
                <strong>Cargo Type:</strong> {selectedBid.cargoType}
              </p>
              <p>
                <strong>Estimated Delivery Date:</strong>{' '}
                {new Date(selectedBid.estimatedDeliveryDate * 1000).toLocaleDateString()}
              </p>
              <p>
                <strong>Final Price:</strong>{' '}
                {ethers.formatUnits(selectedBid.finalPrice, 'ether')} ETH
              </p>
            </div>
            <button 
              onClick={() => setSelectedBid(null)}
              className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidDetailsPage;