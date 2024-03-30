import type { Chain } from "../src/types";
export default {
  "chain": "EGAX",
  "chainId": 5439,
  "explorers": [
    {
      "name": "egoscan",
      "url": "https://egoscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.egochain.org/",
  "name": "Egochain",
  "nativeCurrency": {
    "name": "EGAX",
    "symbol": "EGAX",
    "decimals": 18
  },
  "networkId": 5439,
  "rpc": [
    "https://5439.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.egochain.org"
  ],
  "shortName": "egax",
  "slug": "egochain",
  "testnet": false
} as const satisfies Chain;