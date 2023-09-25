import type { Chain } from "../src/types";
export default {
  "chainId": 127,
  "chain": "FETH",
  "name": "Factory 127 Mainnet",
  "rpc": [],
  "slug": "factory-127",
  "faucets": [],
  "nativeCurrency": {
    "name": "Factory 127 Token",
    "symbol": "FETH",
    "decimals": 18
  },
  "infoURL": "https://www.factory127.com",
  "shortName": "feth",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;