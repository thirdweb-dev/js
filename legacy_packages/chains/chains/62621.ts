import type { Chain } from "../src/types";
export default {
  "chain": "MultiVAC",
  "chainId": 62621,
  "explorers": [
    {
      "name": "MultiVAC Explorer",
      "url": "https://e.mtv.ac",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://mtv.ac",
  "name": "MultiVAC Mainnet",
  "nativeCurrency": {
    "name": "MultiVAC",
    "symbol": "MTV",
    "decimals": 18
  },
  "networkId": 62621,
  "rpc": [
    "https://62621.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mtv.ac",
    "https://rpc-eu.mtv.ac"
  ],
  "shortName": "mtv",
  "slug": "multivac",
  "testnet": false
} as const satisfies Chain;