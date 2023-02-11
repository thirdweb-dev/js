export default {
  "name": "Vision - Mainnet",
  "chain": "Vision",
  "rpc": [
    "https://vision.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://infragrid.v.network/ethereum/compatible"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "VS",
    "symbol": "VS",
    "decimals": 18
  },
  "infoURL": "https://www.v.network",
  "explorers": [
    {
      "name": "Visionscan",
      "url": "https://www.visionscan.org",
      "standard": "EIP3091"
    }
  ],
  "shortName": "vision",
  "chainId": 888888,
  "networkId": 888888,
  "slip44": 60,
  "testnet": false,
  "slug": "vision"
} as const;