import type { Chain } from "../src/types";
export default {
  "name": "Factory 127 Mainnet",
  "chain": "FETH",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Factory 127 Token",
    "symbol": "FETH",
    "decimals": 18
  },
  "infoURL": "https://www.factory127.com",
  "shortName": "feth",
  "chainId": 127,
  "networkId": 127,
  "slip44": 127,
  "testnet": false,
  "slug": "factory-127"
} as const satisfies Chain;