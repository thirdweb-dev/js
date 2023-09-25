import type { Chain } from "../src/types";
export default {
  "chainId": 29,
  "chain": "genesis",
  "name": "Genesis L1",
  "rpc": [
    "https://genesis-l1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genesisl1.org"
  ],
  "slug": "genesis-l1",
  "faucets": [],
  "nativeCurrency": {
    "name": "L1 coin",
    "symbol": "L1",
    "decimals": 18
  },
  "infoURL": "https://www.genesisl1.com",
  "shortName": "L1",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Genesis L1 blockchain explorer",
      "url": "https://explorer.genesisl1.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;