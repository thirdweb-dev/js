import type { Chain } from "../src/types";
export default {
  "chain": "Santiment Intelligence Network",
  "chainId": 32382,
  "explorers": [
    {
      "name": "Santiment Intelligence Explorer",
      "url": "https://app-explorer-pos.sanr.app",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPLMg5mYD8XRknvYbDkD2x7FXxYan7MPTeUWZC2CihwDM",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "infoURL": "https://sanr.app",
  "name": "Santiment Intelligence Network",
  "nativeCurrency": {
    "name": "SANR",
    "symbol": "SANR",
    "decimals": 18
  },
  "networkId": 32382,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://sanr.app"
      }
    ]
  },
  "rpc": [
    "https://32382.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.sanr.app"
  ],
  "shortName": "SANR",
  "slug": "santiment-intelligence-network",
  "testnet": false
} as const satisfies Chain;