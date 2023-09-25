import type { Chain } from "../src/types";
export default {
  "chainId": 1000,
  "chain": "GTON",
  "name": "GTON Mainnet",
  "rpc": [
    "https://gton.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gton.network/"
  ],
  "slug": "gton",
  "faucets": [],
  "nativeCurrency": {
    "name": "GCD",
    "symbol": "GCD",
    "decimals": 18
  },
  "infoURL": "https://gton.capital",
  "shortName": "gton",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "GTON Network Explorer",
      "url": "https://explorer.gton.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;