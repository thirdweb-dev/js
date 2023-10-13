import type { Chain } from "../src/types";
export default {
  "chain": "Taycan",
  "chainId": 2023,
  "explorers": [
    {
      "name": "Taycan Cosmos Explorer",
      "url": "https://cosmoscan-test.hupayx.io",
      "standard": "none"
    },
    {
      "name": "Taycan Explorer(Blockscout)",
      "url": "https://evmscan-test.hupayx.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://ttaycan-faucet.hupayx.io/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
    "width": 1000,
    "height": 1206,
    "format": "png"
  },
  "infoURL": "https://hupayx.io",
  "name": "Taycan Testnet",
  "nativeCurrency": {
    "name": "test-Shuffle",
    "symbol": "tSFL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://taycan-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-taycan.hupayx.io"
  ],
  "shortName": "taycan-testnet",
  "slug": "taycan-testnet",
  "testnet": true
} as const satisfies Chain;