import type { Chain } from "../src/types";
export default {
  "chain": "XPLA",
  "chainId": 37,
  "explorers": [
    {
      "name": "XPLA Explorer",
      "url": "https://explorer.xpla.io/mainnet",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmf4GoxfpeA5VGqu7KP5eyv1WKaCpNDbvMxq1MjQBwFWxq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://xpla.io",
  "name": "Xpla Mainnet",
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "networkId": 37,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://37.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dimension-evm-rpc.xpla.dev"
  ],
  "shortName": "xpla",
  "slug": "xpla",
  "testnet": false
} as const satisfies Chain;