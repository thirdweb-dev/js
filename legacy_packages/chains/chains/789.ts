import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 789,
  "explorers": [
    {
      "name": "patexscan",
      "url": "https://patexscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://patex.io/",
  "name": "Patex",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 789,
  "rpc": [
    "https://789.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.patex.io/"
  ],
  "shortName": "peth",
  "slug": "patex",
  "testnet": false
} as const satisfies Chain;