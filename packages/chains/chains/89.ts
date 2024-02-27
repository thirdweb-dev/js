import type { Chain } from "../src/types";
export default {
  "chain": "TOMO",
  "chainId": 89,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://tomochain.com",
  "name": "TomoChain Testnet",
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "networkId": 89,
  "rpc": [
    "https://89.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tomochain.com"
  ],
  "shortName": "tomot",
  "slip44": 1,
  "slug": "tomochain-testnet",
  "testnet": true
} as const satisfies Chain;