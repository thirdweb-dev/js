import type { Chain } from "../src/types";
export default {
  "chain": "SanRChain",
  "chainId": 11888,
  "explorers": [
    {
      "name": "SanR Chain Explorer",
      "url": "https://sanrchain-explorer.santiment.net",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmPLMg5mYD8XRknvYbDkD2x7FXxYan7MPTeUWZC2CihwDM",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://sanr.app",
  "name": "SanR Chain",
  "nativeCurrency": {
    "name": "nSAN",
    "symbol": "nSAN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://sanr-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sanrchain-node.santiment.net"
  ],
  "shortName": "SAN",
  "slug": "sanr-chain",
  "testnet": false
} as const satisfies Chain;