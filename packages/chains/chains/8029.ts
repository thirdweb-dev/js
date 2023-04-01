import type { Chain } from "../src/types";
export default {
  "name": "MDGL Testnet",
  "chain": "MDGL",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "MDGL Token",
    "symbol": "MDGLT",
    "decimals": 18
  },
  "infoURL": "https://mdgl.io",
  "shortName": "mdgl",
  "chainId": 8029,
  "networkId": 8029,
  "testnet": true,
  "slug": "mdgl-testnet"
} as const satisfies Chain;