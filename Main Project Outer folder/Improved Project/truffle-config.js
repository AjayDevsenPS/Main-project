
require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider("picnic find inject wonder blind grief beef animal crumble rate lunch dog", "https://eth-sepolia.g.alchemy.com/v2/ZwNy8XRFgkCEJYDJPn4wCXuYL9kZrGDl"),
      network_id: 11155111, // Sepolia network ID
      gas: 5000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.18",
    },
  },
};
