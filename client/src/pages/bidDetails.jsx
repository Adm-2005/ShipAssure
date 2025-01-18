import React, { useEffect, useState } from "react";
import { fetchBidIdsByShipper, fetchBidData } from "./FetchBidData";
import { useAccount } from "wagmi";

const BidDetailsPage = () => {
  const { address, isConnected } = useAccount();
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [inputAddress, setInputAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBids = async (walletAddress) => {
    try {
      const bidIds = await fetchBidIdsByShipper(walletAddress);
      const bidDetails = await Promise.all(bidIds.map(fetchBidData));
      setBids(bidDetails.filter((bid) => bid !== null));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to fetch bids. Please check the wallet address.");
      setBids([]);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      // Automatically fetch bids for the connected wallet
      fetchBids(address);
    }
  }, [isConnected, address]);

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    if (ethers.isAddress(inputAddress)) {
      fetchBids(inputAddress);
    } else {
      setErrorMessage("Invalid wallet address.");
    }
  };

  const handleBidClick = (bid) => {
    setSelectedBid(bid);
  };

  return (
    <div>
      <h1>Bid Details</h1>
      
      {!isConnected ? (
        <p>Please connect your wallet to view your bids.</p>
      ) : (
        <div>
          <h2>Search Bids by Wallet Address</h2>
          <form onSubmit={handleAddressSubmit}>
            <input
              type="text"
              placeholder="Enter wallet address"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg mt-2">
              Search
            </button>
          </form>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      )}

      {bids.length === 0 && !errorMessage && (
        <p>Loading or no bids available for this wallet address.</p>
      )}

      {bids.map((bid, index) => (
        <div key={index} onClick={() => handleBidClick(bid)}>
          <p>
            <strong>Bid ID:</strong> {index + 1}
          </p>
          <p>
            <strong>Price:</strong> {ethers.utils.formatUnits(bid.price, "ether")} ETH
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {bid.actualDeliveryDate ? "Completed" : "In Progress"}
          </p>
          <hr />
        </div>
      ))}

      {selectedBid && (
        <div>
          <h3>Bid Details</h3>
          <p><strong>Shipper:</strong> {selectedBid.shipper}</p>
          <p><strong>Price:</strong> {ethers.utils.formatUnits(selectedBid.price, "ether")} ETH</p>
          <p><strong>Shipment Details:</strong> {selectedBid.shipmentDetails}</p>
          <p><strong>Pickup Location:</strong> {selectedBid.pickupLocation.locationName}</p>
          <p><strong>Delivery Location:</strong> {selectedBid.deliveryLocation.locationName}</p>
          <p><strong>Cargo Type:</strong> {selectedBid.cargoType}</p>
          <p>
            <strong>Estimated Delivery Date:</strong>{" "}
            {new Date(selectedBid.estimatedDeliveryDate * 1000).toLocaleDateString()}
          </p>
          <p>
            <strong>Final Price:</strong>{" "}
            {ethers.utils.formatUnits(selectedBid.finalPrice, "ether")} ETH
          </p>
          <button onClick={() => setSelectedBid(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default BidDetailsPage;
