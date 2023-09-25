import type { Chain } from "../src/types";
export default {
  "chainId": 37,
  "chain": "XPLA",
  "name": "Xpla Mainnet",
  "rpc": [
    "https://xpla.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dimension-evm-rpc.xpla.dev"
  ],
  "slug": "xpla",
  "icon": {
    "url": "ipfs://QmbvEAKZfgJckEziU3mpCwz6jqMeWRcLgd8TNsWA7g8sD9/xpla.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "infoURL": "https://xpla.io/",
  "shortName": "xpla",
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "XPLA Explorer",
      "url": "https://explorer.xpla.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;