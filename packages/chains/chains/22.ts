import type { Chain } from "../src/types";
export default {
  "chainId": 22,
  "chain": "ETH",
  "name": "ELA-DID-Sidechain Mainnet",
  "rpc": [],
  "slug": "ela-did-sidechain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "tELA",
    "decimals": 18
  },
  "infoURL": "https://www.elastos.org/",
  "shortName": "eladid",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;