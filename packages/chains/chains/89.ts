import type { Chain } from "../src/types";
export default {
  "chainId": 89,
  "chain": "TOMO",
  "name": "TomoChain Testnet",
  "rpc": [
    "https://tomochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tomochain.com"
  ],
  "slug": "tomochain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "infoURL": "https://tomochain.com",
  "shortName": "tomot",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;