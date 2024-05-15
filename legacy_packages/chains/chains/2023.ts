import type { Chain } from "../src/types";
export default {
  "chain": "Taycan",
  "chainId": 2023,
  "explorers": [
    {
      "name": "Taycan Explorer(Blockscout)",
      "url": "https://evmscan-test.hupayx.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
        "width": 1000,
        "height": 1206,
        "format": "png"
      }
    },
    {
      "name": "Taycan Cosmos Explorer",
      "url": "https://cosmoscan-test.hupayx.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
        "width": 1000,
        "height": 1206,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://ttaycan-faucet.hupayx.io/"
  ],
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
  "networkId": 2023,
  "rpc": [
    "https://2023.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-taycan.hupayx.io"
  ],
  "shortName": "taycan-testnet",
  "slip44": 1,
  "slug": "taycan-testnet",
  "testnet": true
} as const satisfies Chain;