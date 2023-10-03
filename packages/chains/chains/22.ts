import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 22,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.elastos.org/",
  "name": "ELA-DID-Sidechain Mainnet",
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "ELA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "eladid",
  "slug": "ela-did-sidechain",
  "testnet": false
} as const satisfies Chain;