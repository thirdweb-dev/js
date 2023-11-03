import type { Chain } from "../types";
export default {
  "chain": "XPLATest",
  "chainId": 3701,
  "explorers": [
    {
      "name": "XPLA Explorer",
      "url": "https://explorer.xpla.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.xpla.io"
  ],
  "icon": {
    "url": "ipfs://Qmf4GoxfpeA5VGqu7KP5eyv1WKaCpNDbvMxq1MjQBwFWxq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://xpla.io",
  "name": "Xpla Testnet",
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "networkId": 3701,
  "rpc": [
    "https://xpla-testnet-xplatest.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3701.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dimension-rpc.xpla.dev"
  ],
  "shortName": "xplatest",
  "slug": "xpla-testnet-xplatest",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;