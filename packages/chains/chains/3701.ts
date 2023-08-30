import type { Chain } from "../src/types";
export default {
  "name": "Xpla Testnet",
  "chain": "XPLATest",
  "rpc": [
    "https://xpla-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dimension-rpc.xpla.dev"
  ],
  "faucets": [
    "https://faucet.xpla.io"
  ],
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "infoURL": "https://xpla.io",
  "shortName": "xplatest",
  "chainId": 3701,
  "networkId": 3701,
  "icon": {
    "url": "ipfs://Qmf4GoxfpeA5VGqu7KP5eyv1WKaCpNDbvMxq1MjQBwFWxq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "XPLA Explorer",
      "url": "https://explorer.xpla.io",
      "standard": "none"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ],
  "testnet": true,
  "slug": "xpla-testnet"
} as const satisfies Chain;