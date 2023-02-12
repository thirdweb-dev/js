export default {
  "name": "Metal C-Chain",
  "chain": "Metal",
  "rpc": [
    "https://metal-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metalblockchain.org/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metal",
    "symbol": "METAL",
    "decimals": 18
  },
  "infoURL": "https://www.metalblockchain.org/",
  "shortName": "metal",
  "chainId": 381931,
  "networkId": 381931,
  "slip44": 9005,
  "explorers": [
    {
      "name": "metalscan",
      "url": "https://metalscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "metal-c-chain"
} as const;