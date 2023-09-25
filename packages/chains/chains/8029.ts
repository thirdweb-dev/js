import type { Chain } from "../src/types";
export default {
  "chainId": 8029,
  "chain": "MDGL",
  "name": "MDGL Testnet",
  "rpc": [
    "https://mdgl-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.mdgl.io"
  ],
  "slug": "mdgl-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "MDGL Token",
    "symbol": "MDGLT",
    "decimals": 18
  },
  "infoURL": "https://mdgl.io",
  "shortName": "mdgl",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;