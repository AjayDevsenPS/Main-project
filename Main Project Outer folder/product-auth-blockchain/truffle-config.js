const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "picnic find inject wonder blind grief beef animal crumble rate lunch dog"; // Replace with your MetaMask seed phrase
const infuraUrl = "https://sepolia.infura.io/v3/ff71eeb28f464be7be89e6583d70bfc3"; // Replace with your Infura project ID

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost
      port: 7545,        // Port Ganache is running on
      network_id: "*",   // Match any network ID
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(mnemonic, infuraUrl),
      network_id: 11155111,  // Sepolia network ID
      gas: 4500000,          // Gas limit (adjust as needed)
      gasPrice: 10000000000, // Gas price in wei (10 gwei)
      confirmations: 2,      // Confirmations to wait between deployments
      timeoutBlocks: 200,    // Timeout for blocks
      skipDryRun: true,      // Skip dry run before migrations
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Use Solidity compiler version 0.8.0
    },
  },
};
