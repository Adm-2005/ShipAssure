import React, { useState } from "react";
import ABI from "../../../blockchain/constants/abi.json";
import { ethers } from "ethers";

const contractAddress = "0xD201a1771fC9489658Bec98e6225350d92933Cd9";
const contractABI = ABI;

const BidSubmissionPage = () => {
  const [formData, setFormData] = useState({
    price: "",
    shipmentDetails: "",
    shipperAddress: "",
    pickupLatitude: "",
    pickupLongitude: "",
    pickupLocationName: "",
    deliveryLatitude: "",
    deliveryLongitude: "",
    deliveryLocationName: "",
    cargoType: "",
    load: "",
    deliveryDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchToPolygonAmoy = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed!");
  
      const chainIdHex = "0x13882";
  
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
  
      console.log("Switched to Polygon Amoy network");
    } catch (error) {
      if ((error as { code: number }).code === 4902) {
        try {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x80002",
                    chainName: "Polygon Amoy",
                    nativeCurrency: {
                      name: "Polygon Amoy",
                      symbol: "AMOY",
                      decimals: 18,
                    },
                    rpcUrls: ["https://rpc-amoy.polygon.technology/"],
                    blockExplorerUrls: ["https://amoy-explorer.example.com/"],
                  },
                ],
              });              
          console.log("Polygon Amoy network added to MetaMask");
        } catch (addError) {
          console.error("Error adding Polygon Amoy network:", addError);
          throw addError;
        }
      } else {
        console.error("Error switching to Polygon Amoy network:", error);
        throw error;
      }
    }
  };

  const submitBid = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      if (!ethers.isAddress(formData.shipperAddress)) {
        alert("Please enter a valid shipper wallet address!");
        return;
      }

      await switchToPolygonAmoy();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const bidParams = {
        price: ethers.parseUnits(formData.price, 18),
        shipmentDetails: formData.shipmentDetails,
        shipperAddress: formData.shipperAddress, // Added shipper address
        pickupLocation: {
          latitude: parseInt(formData.pickupLatitude),
          longitude: parseInt(formData.pickupLongitude),
          locationName: formData.pickupLocationName,
        },
        deliveryLocation: {
          latitude: parseInt(formData.deliveryLatitude),
          longitude: parseInt(formData.deliveryLongitude),
          locationName: formData.deliveryLocationName,
        },
        cargo: {
          cargoType: formData.cargoType,
          load: parseInt(formData.load),
        },
        delivery: {
          deliveryDate: parseInt(formData.deliveryDate),
          price: ethers.parseUnits(formData.price, 18),
        },
      };

      const tx = await contract.createBid(bidParams);
      console.log("Transaction sent, waiting for confirmation...", tx.hash);
      await tx.wait();
      alert("Bid submitted successfully!");
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Check console for details.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Submit a Bid (Polygon Network)</h1>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="price"
          placeholder="Price (MATIC)"
          value={formData.price}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          name="shipmentDetails"
          placeholder="Shipment Details"
          value={formData.shipmentDetails}
          onChange={handleChange}
          className="border rounded p-2"
        />
        {/* Added Shipper Address input */}
        <input
          type="text"
          name="shipperAddress"
          placeholder="Shipper Wallet Address (0x...)"
          value={formData.shipperAddress}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <h2 className="font-semibold">Pickup Location</h2>
        <input
          type="text"
          name="pickupLatitude"
          placeholder="Latitude"
          value={formData.pickupLatitude}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          name="pickupLongitude"
          placeholder="Longitude"
          value={formData.pickupLongitude}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          name="pickupLocationName"
          placeholder="Location Name"
          value={formData.pickupLocationName}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <h2 className="font-semibold">Delivery Location</h2>
        <input
          type="text"
          name="deliveryLatitude"
          placeholder="Latitude"
          value={formData.deliveryLatitude}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          name="deliveryLongitude"
          placeholder="Longitude"
          value={formData.deliveryLongitude}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          name="deliveryLocationName"
          placeholder="Location Name"
          value={formData.deliveryLocationName}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <h2 className="font-semibold">Cargo Details</h2>
        <input
          type="text"
          name="cargoType"
          placeholder="Cargo Type"
          value={formData.cargoType}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          name="load"
          placeholder="Load (kg)"
          value={formData.load}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <h2 className="font-semibold">Delivery Details</h2>
        <input
          type="text"
          name="deliveryDate"
          placeholder="Delivery Date (Unix Timestamp)"
          value={formData.deliveryDate}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <button
          onClick={submitBid}
          className="bg-blue-500 text-white rounded p-2 mt-4"
        >
          Submit Bid
        </button>
      </div>
    </div>
  );
};

export default BidSubmissionPage;