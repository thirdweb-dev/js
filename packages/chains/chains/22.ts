import type { Chain } from "../src/types";
export default {
  "name": "ELA-DID-Sidechain Mainnet",
  "chain": "ETH",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "ELA",
    "decimals": 18
  },
  "infoURL": "https://www.elastos.org/",
  "shortName": "eladid",
  "chainId": 22,
  "networkId": 22,
  "testnet": false,
  "slug": "ela-did-sidechain"
} as const satisfies Chain;