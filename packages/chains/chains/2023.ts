import type { Chain } from "../src/types";
export default {
  "chainId": 2023,
  "chain": "Taycan",
  "name": "Taycan Testnet",
  "rpc": [
    "https://taycan-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-taycan.hupayx.io"
  ],
  "slug": "taycan-testnet",
  "icon": {
    "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
    "width": 1000,
    "height": 1206,
    "format": "png"
  },
  "faucets": [
    "https://ttaycan-faucet.hupayx.io/"
  ],
  "nativeCurrency": {
    "name": "test-Shuffle",
    "symbol": "tSFL",
    "decimals": 18
  },
  "infoURL": "https://hupayx.io",
  "shortName": "taycan-testnet",
  "testnet": true,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;