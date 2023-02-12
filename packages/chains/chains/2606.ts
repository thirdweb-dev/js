export default {
  "name": "PoCRNet",
  "title": "Proof of Carbon Reduction mainnet",
  "chain": "CRC",
  "status": "active",
  "rpc": [
    "https://pocrnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pocrnet.westeurope.cloudapp.azure.com/http",
    "wss://pocrnet.westeurope.cloudapp.azure.com/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Carbon Reduction Coin",
    "symbol": "CRC",
    "decimals": 18
  },
  "infoURL": "https://github.com/ethereum-pocr/pocrnet",
  "shortName": "pocrnet",
  "chainId": 2606,
  "networkId": 2606,
  "explorers": [
    {
      "name": "Lite Explorer",
      "url": "https://ethereum-pocr.github.io/explorer/pocrnet",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "pocrnet"
} as const;