import type { Chain } from "../src/types";
export default {
  "chain": "AME",
  "chainId": 180,
  "explorers": [
    {
      "name": "AME Scan",
      "url": "https://amescan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://amechain.io/",
  "name": "AME Chain Mainnet",
  "nativeCurrency": {
    "name": "AME",
    "symbol": "AME",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ame-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.amechain.io/"
  ],
  "shortName": "ame",
  "slug": "ame-chain",
  "testnet": false
} as const satisfies Chain;