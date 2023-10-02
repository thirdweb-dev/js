import type { Chain } from "../src/types";
export default {
  "chain": "TOMO",
  "chainId": 89,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://tomochain.com",
  "name": "TomoChain Testnet",
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tomochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tomochain.com"
  ],
  "shortName": "tomot",
  "slug": "tomochain-testnet",
  "testnet": true
} as const satisfies Chain;