import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 23,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://elaeth.io/",
  "name": "ELA-DID-Sidechain Testnet",
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "tELA",
    "decimals": 18
  },
  "networkId": 23,
  "rpc": [],
  "shortName": "eladidt",
  "slip44": 1,
  "slug": "ela-did-sidechain-testnet",
  "testnet": true
} as const satisfies Chain;