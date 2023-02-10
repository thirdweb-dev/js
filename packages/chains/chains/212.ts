export default {
  "name": "MAP Makalu",
  "title": "MAP Testnet Makalu",
  "chain": "MAP",
  "rpc": [
    "https://testnet-rpc.maplabs.io"
  ],
  "faucets": [
    "https://faucet.maplabs.io"
  ],
  "nativeCurrency": {
    "name": "Makalu MAP",
    "symbol": "MAP",
    "decimals": 18
  },
  "infoURL": "https://maplabs.io",
  "shortName": "makalu",
  "chainId": 212,
  "networkId": 212,
  "explorers": [
    {
      "name": "mapscan",
      "url": "https://testnet.mapscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "map-makalu"
} as const;