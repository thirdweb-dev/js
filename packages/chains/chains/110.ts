import type { Chain } from "../src/types";
export default {
  "name": "Proton Testnet",
  "chain": "XPR",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Proton",
    "symbol": "XPR",
    "decimals": 4
  },
  "infoURL": "https://protonchain.com",
  "shortName": "xpr",
  "chainId": 110,
  "networkId": 110,
  "testnet": true,
  "slug": "proton-testnet"
} as const satisfies Chain;