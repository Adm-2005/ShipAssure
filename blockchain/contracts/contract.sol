// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FreightBidding is Ownable {
    struct Location {
        int256 latitude;  // Stored as integer with 6 decimal places (multiply by 1e6)
        int256 longitude; // Stored as integer with 6 decimal places (multiply by 1e6)
        string locationName;
    }

    struct CargoDetails {
        string cargoType; // e.g., "Perishable", "Hazardous", "General"
        uint256 load;
    }

    struct DeliveryDetails {
        uint256 deliveryDate; // Unix timestamp
        uint256 price;        // in wei
    }

    struct Bid {
        address shipper;
        uint256 price;
        string shipmentDetails;
        uint256 timestamp;
        Location pickupLocation;
        Location deliveryLocation;
        CargoDetails cargo;
        DeliveryDetails delivery;
    }

    struct CreateBidParams {
        uint256 price;
        string shipmentDetails;
        Location pickupLocation;
        Location deliveryLocation;
        CargoDetails cargo;
        DeliveryDetails delivery;
    }

    mapping(uint256 => Bid) public bids;
    mapping(address => uint256[]) public shipperBids; // Mapping from shipper address to an array of their bid IDs
    uint256 public bidCounter;

    event BidCreated(
        uint256 indexed bidId,
        address indexed shipper,
        uint256 price,
        string shipmentDetails,
        int256 pickupLatitude,
        int256 pickupLongitude,
        int256 deliveryLatitude,
        int256 deliveryLongitude,
        string cargoType,
        uint256 deliveryDate
    );

    event BidCompleted(
        uint256 indexed bidId,
        uint256 actualDeliveryDate,
        uint256 finalCost
    );

    event BidCancelled(uint256 indexed bidId);

    constructor() Ownable(msg.sender) {
        bidCounter = 0;
    }

    modifier validBidId(uint256 bidId) {
        require(bidId < bidCounter, "Invalid bid ID");
        _;
    }

    function createBid(CreateBidParams calldata params) external returns (uint256) {
        require(params.price > 0, "Price must be greater than 0");
        require(bytes(params.shipmentDetails).length > 0, "Shipment details required");
        require(params.delivery.deliveryDate > block.timestamp, "Invalid delivery date");

        uint256 bidId = bidCounter++;

        bids[bidId] = Bid({
            shipper: msg.sender,
            price: params.price,
            shipmentDetails: params.shipmentDetails,
            timestamp: block.timestamp,
            pickupLocation: params.pickupLocation,
            deliveryLocation: params.deliveryLocation,
            cargo: params.cargo,
            delivery: params.delivery
        });

        shipperBids[msg.sender].push(bidId);

        emit BidCreated(
            bidId,
            msg.sender,
            params.price,
            params.shipmentDetails,
            params.pickupLocation.latitude,
            params.pickupLocation.longitude,
            params.deliveryLocation.latitude,
            params.deliveryLocation.longitude,
            params.cargo.cargoType,
            params.delivery.deliveryDate
        );

        return bidId;
    }

    function completeBid(uint256 bidId, uint256 deliveryDate, uint256 finalCost) 
        external
        validBidId(bidId)
    {
        Bid storage bid = bids[bidId];
        require(msg.sender == bid.shipper, "Only shipper can complete");

        bid.delivery.price = finalCost;
        emit BidCompleted(bidId, deliveryDate, finalCost);
    }

    function cancelBid(uint256 bidId) 
        external 
        validBidId(bidId)
    {
        Bid storage bid = bids[bidId];
        require(msg.sender == bid.shipper, "Only shipper can cancel");

        delete bids[bidId];

        uint256[] storage bidList = shipperBids[msg.sender];
        for (uint256 i = 0; i < bidList.length; i++) {
            if (bidList[i] == bidId) {
                bidList[i] = bidList[bidList.length - 1];
                bidList.pop();
                break;
            }
        }

        emit BidCancelled(bidId);
    }

    function getBid(uint256 bidId) 
        external 
        view 
        validBidId(bidId)
        returns (
            address shipper,
            uint256 price,
            string memory shipmentDetails,
            uint256 timestamp,
            Location memory pickupLocation,
            Location memory deliveryLocation,
            CargoDetails memory cargo,
            DeliveryDetails memory delivery
        ) 
    {
        Bid storage bid = bids[bidId];
        return (
            bid.shipper,
            bid.price,
            bid.shipmentDetails,
            bid.timestamp,
            bid.pickupLocation,
            bid.deliveryLocation,
            bid.cargo,
            bid.delivery
        );
    }

    function getShipperBids(address shipper) external view returns (uint256[] memory) {
        return shipperBids[shipper];
    }
}