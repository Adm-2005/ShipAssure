const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(formatetherdeployer.address);
  console.log("Account balance:", balance);

  const Contract = await hre.ethers.getContractFactory("FreightBidding");

  // Deploy the contract
  const contract = await Contract.deploy();
  
  await contract.waitForDeployment();

  // Get the deployed contract address
  const contractAddress = await contract.getAddress();

  console.log("Contract deployed to address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });