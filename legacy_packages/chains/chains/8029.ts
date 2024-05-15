import type { Chain } from "../src/types";
export default {
  "chain": "MDGL",
  "chainId": 8029,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://mdgl.io",
  "name": "MDGL Testnet",
  "nativeCurrency": {
    "name": "MDGL Token",
    "symbol": "MDGLT",
    "decimals": 18
  },
  "networkId": 8029,
  "rpc": [
    "https://8029.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.mdgl.io"
  ],
  "shortName": "mdgl",
  "slip44": 1,
  "slug": "mdgl-testnet",
  "testnet": true
} as const satisfies Chain;