export default {
  "name": "ONUS Chain Mainnet",
  "title": "ONUS Chain Mainnet",
  "chain": "onus",
  "rpc": [
    "https://onus-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.onuschain.io",
    "wss://ws.onuschain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "infoURL": "https://onuschain.io",
  "shortName": "onus-mainnet",
  "chainId": 1975,
  "networkId": 1975,
  "explorers": [
    {
      "name": "Onus explorer mainnet",
      "url": "https://explorer.onuschain.io",
      "icon": "onus",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "onus-chain"
} as const;