import type { Chain } from "../src/types";
export default {
  "chain": "Taycan",
  "chainId": 22023,
  "explorers": [
    {
      "name": "Taycan Cosmos Explorer(BigDipper)",
      "url": "https://taycan-cosmoscan.hupayx.io",
      "standard": "none"
    },
    {
      "name": "Taycan Explorer(Blockscout)",
      "url": "https://taycan-evmscan.hupayx.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
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
  "redFlags": [],
  "rpc": [
    "https://taycan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://taycan-rpc.hupayx.io:8545"
  ],
  "shortName": "SFL",
  "slug": "taycan",
  "testnet": false
} as const satisfies Chain;