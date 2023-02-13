export default {
  "name": "MultiVAC Mainnet",
  "chain": "MultiVAC",
  "icon": {
    "url": "ipfs://QmWb1gthhbzkiLdgcP8ccZprGbJVjFcW8Rn4uJjrw4jd3B",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "rpc": [
    "https://multivac.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mtv.ac",
    "https://rpc-eu.mtv.ac"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MultiVAC",
    "symbol": "MTV",
    "decimals": 18
  },
  "infoURL": "https://mtv.ac",
  "shortName": "mtv",
  "chainId": 62621,
  "networkId": 62621,
  "explorers": [
    {
      "name": "MultiVAC Explorer",
      "url": "https://e.mtv.ac",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "multivac"
} as const;