import type { Chain } from "../src/types";
export default {
  "chainId": 614,
  "chain": "GLQ Blockchain",
  "name": "Graphlinq Blockchain Mainnet",
  "rpc": [
    "https://graphlinq-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://glq-dataseed.graphlinq.io"
  ],
  "slug": "graphlinq-blockchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "GLQ",
    "symbol": "GLQ",
    "decimals": 18
  },
  "infoURL": "https://graphlinq.io",
  "shortName": "glq",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "GLQ Explorer",
      "url": "https://explorer.graphlinq.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;