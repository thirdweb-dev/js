import type { Chain } from "../src/types";
export default {
  "chainId": 2415,
  "chain": "XODEX",
  "name": "XODEX",
  "rpc": [
    "https://xodex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.xo-dex.com/rpc",
    "https://xo-dex.io"
  ],
  "slug": "xodex",
  "icon": {
    "url": "ipfs://QmXt49jPfHUmDF4n8TF7ks6txiPztx6qUHanWmHnCoEAhW",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "XODEX Native Token",
    "symbol": "XODEX",
    "decimals": 18
  },
  "infoURL": "https://xo-dex.com",
  "shortName": "xodex",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "XODEX Explorer",
      "url": "https://explorer.xo-dex.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;