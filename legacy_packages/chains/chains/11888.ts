import type { Chain } from "../src/types";
export default {
  "chain": "Santiment Intelligence Network DEPRECATED",
  "chainId": 11888,
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
  "name": "Santiment Intelligence Network DEPRECATED",
  "nativeCurrency": {
    "name": "SANold",
    "symbol": "SANold",
    "decimals": 18
  },
  "networkId": 11888,
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
    "https://11888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sanrchain-node.santiment.net"
  ],
  "shortName": "SANold",
  "slug": "santiment-intelligence-network-deprecated",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;