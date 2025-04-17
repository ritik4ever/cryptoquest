require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1281, // Local testing network
    },
    monad: {
      url: "https://rpc.monad.xyz/testnet", // Replace with actual Monad RPC URL
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // Replace with your secure mnemonic
      },
      chainId: 1285, // Replace with actual Monad chainId
    }
  }
};