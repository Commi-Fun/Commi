import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy AirdropToken
  const AirdropToken = await ethers.getContractFactory("AirdropToken");
  const initialSupply = ethers.parseUnits("100000000", 18); // 100M tokens
  
  console.log("Deploying AirdropToken...");
  const airdropToken = await AirdropToken.deploy(
    "AI Airdrop Token",
    "AIAT",
    initialSupply
  );
  
  await airdropToken.waitForDeployment();
  const tokenAddress = await airdropToken.getAddress();
  
  console.log("AirdropToken deployed to:", tokenAddress);

  // Deploy AirdropDistributor
  console.log("Deploying AirdropDistributor...");
  const AirdropDistributor = await ethers.getContractFactory("AirdropDistributor");
  const distributor = await AirdropDistributor.deploy(tokenAddress);
  
  await distributor.waitForDeployment();
  const distributorAddress = await distributor.getAddress();
  
  console.log("AirdropDistributor deployed to:", distributorAddress);

  // Setup permissions
  console.log("Setting up permissions...");
  
  // Add distributor as minter
  await airdropToken.addMinter(distributorAddress);
  console.log("Added distributor as token minter");
  
  // Transfer some tokens to distributor for initial rewards
  const distributorBalance = ethers.parseUnits("10000000", 18); // 10M tokens
  await airdropToken.transfer(distributorAddress, distributorBalance);
  console.log("Transferred tokens to distributor");

  // Verify deployment
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", await deployer.provider.getNetwork());
  console.log("AirdropToken:", tokenAddress);
  console.log("AirdropDistributor:", distributorAddress);
  console.log("Token Total Supply:", ethers.formatUnits(await airdropToken.totalSupply(), 18));
  console.log("Distributor Token Balance:", ethers.formatUnits(await airdropToken.balanceOf(distributorAddress), 18));
  
  // Save deployment info
  const deploymentInfo = {
    network: (await deployer.provider.getNetwork()).name,
    chainId: (await deployer.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      AirdropToken: {
        address: tokenAddress,
        name: "AI Airdrop Token",
        symbol: "AIAT",
        totalSupply: ethers.formatUnits(await airdropToken.totalSupply(), 18)
      },
      AirdropDistributor: {
        address: distributorAddress,
        minInfluenceScore: await distributor.minInfluenceScore(),
        rewardAmount: ethers.formatUnits(await distributor.rewardAmount(), 18),
        cooldownPeriod: (await distributor.cooldownPeriod()).toString()
      }
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n=== Deployment Info ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });