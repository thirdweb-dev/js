export default {
  "name": "ONUS Chain Testnet",
  "title": "ONUS Chain Testnet",
  "chain": "onus",
  "rpc": [
    "https://onus-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.onuschain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "infoURL": "https://onuschain.io",
  "shortName": "onus-testnet",
  "chainId": 1945,
  "networkId": 1945,
  "explorers": [
    {
      "name": "Onus explorer testnet",
      "url": "https://explorer-testnet.onuschain.io",
      "icon": "onus",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "onus-chain-testnet"
} as const;