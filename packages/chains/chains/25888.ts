export default {
  "name": "Hammer Chain Mainnet",
  "chain": "HammerChain",
  "rpc": [
    "https://hammer-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.hammerchain.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GOLDT",
    "symbol": "GOLDT",
    "decimals": 18
  },
  "infoURL": "https://www.hammerchain.io",
  "shortName": "GOLDT",
  "chainId": 25888,
  "networkId": 25888,
  "explorers": [
    {
      "name": "Hammer Chain Explorer",
      "url": "https://www.hammerchain.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "hammer-chain"
} as const;