import type { Chain } from "../src/types";
export default {
  "chainId": 11888,
  "chain": "SanRChain",
  "name": "SanR Chain",
  "rpc": [
    "https://sanr-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sanrchain-node.santiment.net"
  ],
  "slug": "sanr-chain",
  "icon": {
    "url": "ipfs://QmPLMg5mYD8XRknvYbDkD2x7FXxYan7MPTeUWZC2CihwDM",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "nSAN",
    "symbol": "nSAN",
    "decimals": 18
  },
  "infoURL": "https://sanr.app",
  "shortName": "SAN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SanR Chain Explorer",
      "url": "https://sanrchain-explorer.santiment.net",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;