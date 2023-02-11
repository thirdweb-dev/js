export default {
  "name": "Metal Tahoe C-Chain",
  "chain": "Metal",
  "rpc": [
    "https://metal-tahoe-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tahoe.metalblockchain.org/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metal",
    "symbol": "METAL",
    "decimals": 18
  },
  "infoURL": "https://www.metalblockchain.org/",
  "shortName": "Tahoe",
  "chainId": 381932,
  "networkId": 381932,
  "slip44": 9005,
  "explorers": [
    {
      "name": "metalscan",
      "url": "https://tahoe.metalscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "metal-tahoe-c-chain"
} as const;