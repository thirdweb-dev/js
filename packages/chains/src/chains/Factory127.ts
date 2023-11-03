import type { Chain } from "../types";
export default {
  "chain": "FETH",
  "chainId": 127,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.factory127.com",
  "name": "Factory 127 Mainnet",
  "nativeCurrency": {
    "name": "Factory 127 Token",
    "symbol": "FETH",
    "decimals": 18
  },
  "networkId": 127,
  "rpc": [],
  "shortName": "feth",
  "slip44": 127,
  "slug": "factory-127",
  "testnet": false
} as const satisfies Chain;