import type { Chain } from "../types";
export default {
  "chain": "iChain",
  "chainId": 3639,
  "explorers": [
    {
      "name": "iChainscan",
      "url": "https://ichainscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://islamicoin.finance",
  "name": "iChain Network",
  "nativeCurrency": {
    "name": "ISLAMICOIN",
    "symbol": "ISLAMI",
    "decimals": 18
  },
  "networkId": 3639,
  "rpc": [
    "https://ichain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3639.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ichainscan.com"
  ],
  "shortName": "ISLAMI",
  "slug": "ichain-network",
  "testnet": false
} as const satisfies Chain;