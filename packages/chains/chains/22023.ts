import type { Chain } from "../src/types";
export default {
  "chainId": 22023,
  "chain": "Taycan",
  "name": "Taycan",
  "rpc": [
    "https://taycan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://taycan-rpc.hupayx.io:8545"
  ],
  "slug": "taycan",
  "icon": {
    "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
    "width": 1000,
    "height": 1206,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "shuffle",
    "symbol": "SFL",
    "decimals": 18
  },
  "infoURL": "https://hupayx.io",
  "shortName": "SFL",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;