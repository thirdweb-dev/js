import type { Chain } from "../types";
export default {
  "chain": "genesis",
  "chainId": 29,
  "explorers": [
    {
      "name": "Genesis L1 blockchain explorer",
      "url": "https://explorer.genesisl1.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.genesisl1.com",
  "name": "Genesis L1",
  "nativeCurrency": {
    "name": "L1 coin",
    "symbol": "L1",
    "decimals": 18
  },
  "networkId": 29,
  "rpc": [
    "https://genesis-l1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://29.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.genesisl1.org"
  ],
  "shortName": "L1",
  "slug": "genesis-l1",
  "testnet": false
} as const satisfies Chain;