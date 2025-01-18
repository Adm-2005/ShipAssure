import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

const contractABI = [
  "function getShipperBids(address shipper) public view returns (uint256[] memory)",
  "function getBid(uint256 bidId) public view returns (address,uint256,string,uint256,(int256,int256,string),(int256,int256,string),(string,uint256),(uint256,uint256,uint256))"
];

const contractAddress = "0xYourContractAddress"; // Replace with your contract address
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export const fetchBidIdsByShipper = async (shipperAddress: string) => {
  try {
    return await contract.getBidsByShipper(shipperAddress);
  } catch (error) {
    console.error("Error fetching bid IDs:", error);
    return [];
  }
};

// Function to fetch bid data
export const fetchBidData = async (bidId: number) => {
    try {
        const bidDetails = await contract.getBid(bidId);
        return bidDetails;
    } catch (error) {
        console.error("Error fetching bid details:", error);
        throw error;
    }
};