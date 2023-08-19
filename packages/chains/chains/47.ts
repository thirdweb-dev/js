import type { Chain } from "../src/types";
export default {
  "name": "Xpla Testnet",
  "chain": "XPLA",
  "rpc": [
    "https://xpla-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cube-evm-rpc.xpla.dev"
  ],
  "nativeCurrency": {
    "name": "XPLA",
    "symbol": "XPLA",
    "decimals": 18
  },
  "faucets": [
    "https://faucet.xpla.io/"
  ],
  "infoURL": "https://xpla.io/",
  "shortName": "xpla-test",
  "chainId": 47,
  "icon": {
    "url": "ipfs://Qmf4GoxfpeA5VGqu7KP5eyv1WKaCpNDbvMxq1MjQBwFWxq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "XPLA Explorer",
      "url": "https://explorer.xpla.io/testnet",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "xpla-testnet"
} as const satisfies Chain;