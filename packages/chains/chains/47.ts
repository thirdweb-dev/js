import type { Chain } from "../src/types";
export default {
  "chainId": 47,
  "chain": "XPLA",
  "name": "Xpla Testnet",
  "rpc": [
    "https://xpla-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cube-evm-rpc.xpla.dev"
  ],
  "slug": "xpla-testnet",
  "icon": {
    "url": "ipfs://QmbvEAKZfgJckEziU3mpCwz6jqMeWRcLgd8TNsWA7g8sD9/xpla.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.xpla.io/"
  ],
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "infoURL": "https://xpla.io/",
  "shortName": "xpla-test",
  "testnet": true,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "XPLA Explorer",
      "url": "https://explorer.xpla.io/testnet",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;