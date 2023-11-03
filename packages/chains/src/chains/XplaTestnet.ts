import type { Chain } from "../types";
export default {
  "chain": "XPLA",
  "chainId": 47,
  "explorers": [
    {
      "name": "XPLA Explorer",
      "url": "https://explorer.xpla.io/testnet",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.xpla.io/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmbvEAKZfgJckEziU3mpCwz6jqMeWRcLgd8TNsWA7g8sD9/xpla.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://xpla.io/",
  "name": "Xpla Testnet",
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "networkId": 47,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://xpla-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://47.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cube-evm-rpc.xpla.dev"
  ],
  "shortName": "xpla-test",
  "slug": "xpla-testnet",
  "testnet": true
} as const satisfies Chain;