import type { Chain } from "../src/types";
export default {
  "name": "Tectum Emission Token",
  "chain": "TET",
  "rpc": [
    "https://tectum-emission-token.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.softnote.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tectum",
    "symbol": "TET",
    "decimals": 8
  },
  "infoURL": "https://softnote.com",
  "shortName": "tet",
  "chainId": 1003,
  "networkId": 1003,
  "explorers": [
    {
      "name": "Tectum explorer",
      "url": "https://explorer.tectum.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "tectum-emission-token"
} as const satisfies Chain;