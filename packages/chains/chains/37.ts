import type { Chain } from "../src/types";
export default {
  "chain": "XPLA",
  "chainId": 37,
  "explorers": [
    {
      "name": "XPLA Explorer",
      "url": "https://explorer.xpla.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbvEAKZfgJckEziU3mpCwz6jqMeWRcLgd8TNsWA7g8sD9/xpla.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://xpla.io/",
  "name": "Xpla Mainnet",
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://xpla.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dimension-evm-rpc.xpla.dev"
  ],
  "shortName": "xpla",
  "slug": "xpla",
  "testnet": false
} as const satisfies Chain;