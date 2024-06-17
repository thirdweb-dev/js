import type { Chain } from "../src/types";
export default {
  "chain": "NEAR",
  "chainId": 397,
  "explorers": [
    {
      "name": "Near Blocks",
      "url": "https://nearblocks.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://near.org/",
  "name": "Near Mainnet",
  "nativeCurrency": {
    "name": "NEAR",
    "symbol": "NEAR",
    "decimals": 18
  },
  "networkId": 397,
  "rpc": [],
  "shortName": "near",
  "slug": "near",
  "testnet": false
} as const satisfies Chain;