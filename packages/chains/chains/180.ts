import type { Chain } from "../src/types";
export default {
  "chainId": 180,
  "chain": "AME",
  "name": "AME Chain Mainnet",
  "rpc": [
    "https://ame-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.amechain.io/"
  ],
  "slug": "ame-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "AME",
    "symbol": "AME",
    "decimals": 18
  },
  "infoURL": "https://amechain.io/",
  "shortName": "ame",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "AME Scan",
      "url": "https://amescan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;