import type { Chain } from "../src/types";
export default {
  "chain": "EKTA",
  "chainId": 1994,
  "explorers": [
    {
      "name": "ektascan",
      "url": "https://ektascan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmfMd564KUPK8eKZDwGCT71ZC2jMnUZqP6LCtLpup3rHH1",
        "width": 2100,
        "height": 2100,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfMd564KUPK8eKZDwGCT71ZC2jMnUZqP6LCtLpup3rHH1",
    "width": 2100,
    "height": 2100,
    "format": "png"
  },
  "infoURL": "https://www.ekta.io",
  "name": "Ekta",
  "nativeCurrency": {
    "name": "EKTA",
    "symbol": "EKTA",
    "decimals": 18
  },
  "networkId": 1994,
  "rpc": [
    "https://ekta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1994.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://main.ekta.io"
  ],
  "shortName": "ekta",
  "slug": "ekta",
  "testnet": false
} as const satisfies Chain;