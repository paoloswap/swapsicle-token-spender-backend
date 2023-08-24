const CHAIN_INFO = {
  43113: {
    name: "Avalance Fuji Testnet",
    rpcUrl: "https://rpc.ankr.com/avalanche_fuji",
    lowGasAmount: 1,
    criticallyLowGasAmount: 0.1,
  },
  43114: {
    name: "Avalance C-Chain",
    rpcUrl: "http://10.8.0.5:9650/ext/bc/C/rpc",
    lowGasAmount: 1,
    criticallyLowGasAmount: 0.1,
  },
  40: {
    name: "Telos",
    explorerUrl: "https://www.teloscan.io",
    rpcUrl: "https://mainnet.telos.net/evm",
    lowGasAmount: 1,
    criticallyLowGasAmount: 0.1,
  },
  41: {
    name: "Telos Testnet",
    explorerUrl: "https://testnet.teloscan.io",
    rpcUrl: "https://testnet.telos.net/evm",
    lowGasAmount: 1,
    criticallyLowGasAmount: 0.1,
  },
  5000: {
    name: "Mantle",
    explorerUrl: "https://explorer.mantle.xyz",
    rpcUrl: "https://rpc.mantle.xyz",
    lowGasAmount: 5,
    criticallyLowGasAmount: 0.5,
  },
  5001: {
    name: "Mantle Testnet",
    explorerUrl: "https://explorer.testnet.mantle.xyz",
    rpcUrl: "https://rpc.testnet.mantle.xyz",
    lowGasAmount: 5,
    criticallyLowGasAmount: 0.5,
  },
}

module.exports = {
  CHAIN_INFO,
}