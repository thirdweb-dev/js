import type { Chain } from "../src/types";
export default {
  "chainId": 7,
  "chain": "TCH",
  "name": "ThaiChain",
  "rpc": [
    "https://thaichain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dome.cloud",
    "https://rpc.thaichain.org"
  ],
  "slug": "thaichain",
  "faucets": [],
  "nativeCurrency": {
    "name": "ThaiChain Ether",
    "symbol": "TCH",
    "decimals": 18
  },
  "infoURL": "https://thaichain.io",
  "shortName": "tch",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Thaichain Explorer",
      "url": "https://exp.thaichain.org",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;