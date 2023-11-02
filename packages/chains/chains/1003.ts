import type { Chain } from "../src/types";
export default {
  "chain": "TET",
  "chainId": 1003,
  "explorers": [
    {
      "name": "Tectum explorer",
      "url": "https://explorer.tectum.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYvFVprVdAGJH4iHUCXGEmy7pq8MMfxEjM64SuXutz9qx",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "infoURL": "https://softnote.com",
  "name": "Tectum Emission Token",
  "nativeCurrency": {
    "name": "Tectum",
    "symbol": "TET",
    "decimals": 8
  },
  "networkId": 1003,
  "rpc": [
    "https://tectum-emission-token.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.softnote.com/"
  ],
  "shortName": "tet",
  "slug": "tectum-emission-token",
  "testnet": false
} as const satisfies Chain;