import type { Chain } from "../src/types";
export default {
  "chainId": 1994,
  "chain": "EKTA",
  "name": "Ekta",
  "rpc": [
    "https://ekta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.ekta.io"
  ],
  "slug": "ekta",
  "icon": {
    "url": "ipfs://QmfMd564KUPK8eKZDwGCT71ZC2jMnUZqP6LCtLpup3rHH1",
    "width": 2100,
    "height": 2100,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "EKTA",
    "symbol": "EKTA",
    "decimals": 18
  },
  "infoURL": "https://www.ekta.io",
  "shortName": "ekta",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ektascan",
      "url": "https://ektascan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;