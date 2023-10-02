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
      "icon": {
        "url": "ipfs://QmYvFVprVdAGJH4iHUCXGEmy7pq8MMfxEjM64SuXutz9qx",
        "width": 256,
        "height": 256,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "tectum-emission-token"
} as const satisfies Chain;