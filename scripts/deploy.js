const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy GameToken
  const GameToken = await hre.ethers.getContractFactory("GameToken");
  const gameToken = await GameToken.deploy();
  await gameToken.deployed();
  console.log("GameToken deployed to:", gameToken.address);

  // Deploy GameItems
  const GameItems = await hre.ethers.getContractFactory("GameItems");
  const gameItems = await GameItems.deploy();
  await gameItems.deployed();
  console.log("GameItems deployed to:", gameItems.address);

  // Deploy GameWorld
  const GameWorld = await hre.ethers.getContractFactory("GameWorld");
  const gameWorld = await GameWorld.deploy();
  await gameWorld.deployed();
  console.log("GameWorld deployed to:", gameWorld.address);

  // Deploy GameLogic with references to other contracts
  const GameLogic = await hre.ethers.getContractFactory("GameLogic");
  const gameLogic = await GameLogic.deploy(
    gameToken.address,
    gameItems.address,
    gameWorld.address
  );
  await gameLogic.deployed();
  console.log("GameLogic deployed to:", gameLogic.address);

  // Grant roles to GameLogic contract
  const MINTER_ROLE = await gameToken.MINTER_ROLE();
  await gameToken.grantRole(MINTER_ROLE, gameLogic.address);
  console.log("Granted MINTER_ROLE to GameLogic for GameToken");

  await gameItems.transferOwnership(gameLogic.address);
  console.log("Transferred ownership of GameItems to GameLogic");

  await gameWorld.transferOwnership(gameLogic.address);
  console.log("Transferred ownership of GameWorld to GameLogic");

  // Save contract addresses for frontend
  const fs = require("fs");
  const contractAddresses = {
    token: gameToken.address,
    items: gameItems.address,
    world: gameWorld.address,
    logic: gameLogic.address
  };

  fs.writeFileSync(
    "./client/src/contractAddresses.json",
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("Contract addresses saved to client/src/contractAddresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });