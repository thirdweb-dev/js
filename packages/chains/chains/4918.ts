export default {
  "name": "Venidium Testnet",
  "chain": "XVM",
  "rpc": [
    "https://rpc-evm-testnet.venidium.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Venidium",
    "symbol": "XVM",
    "decimals": 18
  },
  "infoURL": "https://venidium.io",
  "shortName": "txvm",
  "chainId": 4918,
  "networkId": 4918,
  "explorers": [
    {
      "name": "Venidium EVM Testnet Explorer",
      "url": "https://evm-testnet.venidiumexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "venidium-testnet"
} as const;