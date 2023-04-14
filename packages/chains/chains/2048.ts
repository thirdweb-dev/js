import type { Chain } from "../src/types";
export default {
  "name": "Stratos Mainnet",
  "chain": "STOS",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "infoURL": "https://www.thestratos.org",
  "shortName": "stos-mainnet",
  "chainId": 2048,
  "networkId": 2048,
  "status": "incubating",
  "testnet": false,
  "slug": "stratos"
} as const satisfies Chain;