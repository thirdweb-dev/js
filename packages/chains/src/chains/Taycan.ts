import type { Chain } from "../types";
export default {
  "chain": "Taycan",
  "chainId": 22023,
  "explorers": [
    {
      "name": "Taycan Explorer(Blockscout)",
      "url": "https://taycan-evmscan.hupayx.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
        "width": 1000,
        "height": 1206,
        "format": "png"
      }
    },
    {
      "name": "Taycan Cosmos Explorer(BigDipper)",
      "url": "https://taycan-cosmoscan.hupayx.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
        "width": 1000,
        "height": 1206,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
    "width": 1000,
    "height": 1206,
    "format": "png"
  },
  "infoURL": "https://hupayx.io",
  "name": "Taycan",
  "nativeCurrency": {
    "name": "shuffle",
    "symbol": "SFL",
    "decimals": 18
  },
  "networkId": 22023,
  "rpc": [
    "https://taycan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://22023.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://taycan-rpc.hupayx.io:8545"
  ],
  "shortName": "SFL",
  "slug": "taycan",
  "testnet": false
} as const satisfies Chain;