import type { Chain } from "../src/types";
export default {
  "name": "Xpla Mainnet",
  "chain": "XPLA",
  "rpc": [
    "https://xpla.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dimension-evm-rpc.xpla.dev"
  ],
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "infoURL": "https://xpla.io/",
  "shortName": "xpla",
  "chainId": 37,
  "icon": {
    "url": "ipfs://QmbvEAKZfgJckEziU3mpCwz6jqMeWRcLgd8TNsWA7g8sD9/xpla.png",
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
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "slug": "xpla"
} as const satisfies Chain;