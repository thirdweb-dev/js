import type { Chain } from "../src/types";
export default {
  "chain": "XODEX",
  "chainId": 2415,
  "explorers": [
    {
      "name": "XODEX Explorer",
      "url": "https://explorer.xo-dex.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXt49jPfHUmDF4n8TF7ks6txiPztx6qUHanWmHnCoEAhW",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXt49jPfHUmDF4n8TF7ks6txiPztx6qUHanWmHnCoEAhW",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://xo-dex.com",
  "name": "XODEX",
  "nativeCurrency": {
    "name": "XODEX Native Token",
    "symbol": "XODEX",
    "decimals": 18
  },
  "networkId": 10,
  "rpc": [
    "https://xodex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2415.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.xo-dex.com/rpc",
    "https://xo-dex.io"
  ],
  "shortName": "xodex",
  "slug": "xodex",
  "testnet": false
} as const satisfies Chain;