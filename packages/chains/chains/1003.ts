import type { Chain } from "../src/types";
export default {
  "chainId": 1003,
  "chain": "TET",
  "name": "Tectum Emission Token",
  "rpc": [
    "https://tectum-emission-token.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.softnote.com/"
  ],
  "slug": "tectum-emission-token",
  "faucets": [],
  "nativeCurrency": {
    "name": "Tectum",
    "symbol": "TET",
    "decimals": 8
  },
  "infoURL": "https://softnote.com",
  "shortName": "tet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Tectum explorer",
      "url": "https://explorer.tectum.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;