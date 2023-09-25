import type { Chain } from "../src/types";
export default {
  "chainId": 23,
  "chain": "ETH",
  "name": "ELA-DID-Sidechain Testnet",
  "rpc": [],
  "slug": "ela-did-sidechain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "tELA",
    "decimals": 18
  },
  "infoURL": "https://elaeth.io/",
  "shortName": "eladidt",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;