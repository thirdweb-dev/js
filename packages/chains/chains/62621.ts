import type { Chain } from "../src/types";
export default {
  "chainId": 62621,
  "chain": "MultiVAC",
  "name": "MultiVAC Mainnet",
  "rpc": [
    "https://multivac.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mtv.ac",
    "https://rpc-eu.mtv.ac"
  ],
  "slug": "multivac",
  "icon": {
    "url": "ipfs://QmWb1gthhbzkiLdgcP8ccZprGbJVjFcW8Rn4uJjrw4jd3B",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MultiVAC",
    "symbol": "MTV",
    "decimals": 18
  },
  "infoURL": "https://mtv.ac",
  "shortName": "mtv",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "MultiVAC Explorer",
      "url": "https://e.mtv.ac",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;