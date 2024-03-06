import type { Chain } from "../src/types";
export default {
  "chain": "GLQ Blockchain",
  "chainId": 614,
  "explorers": [
    {
      "name": "GLQ Explorer",
      "url": "https://explorer.graphlinq.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://graphlinq.io",
  "name": "Graphlinq Blockchain Mainnet",
  "nativeCurrency": {
    "name": "GLQ",
    "symbol": "GLQ",
    "decimals": 18
  },
  "networkId": 614,
  "rpc": [
    "https://614.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://glq-dataseed.graphlinq.io"
  ],
  "shortName": "glq",
  "slug": "graphlinq-blockchain",
  "testnet": false
} as const satisfies Chain;