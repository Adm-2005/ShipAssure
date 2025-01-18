// // hardhat.config.js
// require("@nomicfoundation/hardhat-toolbox");
// require('dotenv').config();

// /** @type import('hardhat/config').HardhatUser Config */
// module.exports = {
//   solidity: "0.8.25", // Ensure this matches your contract's Solidity version
//   networks: {
//     mumbai: {
//       url: process.env.POLYGON_MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com", // RPC URL for Mumbai
//       accounts: [process.env.PRIVATE_KEY], // Wallet private key to deploy
//       chainId: 80001 // Ensure the chain ID is correct for Mumbai
//     },
//     polygon: {
//       url: process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-rpc.com",
//       accounts: [process.env.PRIVATE_KEY],
//       chainId: 137
//     }
//   },
//   etherscan: {
//     apiKey: process.env.POLYGONSCAN_API_KEY
//   },
// };
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.25",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002, // Example chainId for Amoy (adjust if incorrect)
    },
    polygon: {
      url: process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};
