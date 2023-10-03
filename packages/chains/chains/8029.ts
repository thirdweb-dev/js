import type { Chain } from "../src/types";
export default {
  "chain": "MDGL",
  "chainId": 8029,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://mdgl.io",
  "name": "MDGL Testnet",
  "nativeCurrency": {
    "name": "MDGL Token",
    "symbol": "MDGLT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://mdgl-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.mdgl.io"
  ],
  "shortName": "mdgl",
  "slug": "mdgl-testnet",
  "testnet": true
} as const satisfies Chain;