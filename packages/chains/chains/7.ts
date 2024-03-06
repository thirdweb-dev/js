import type { Chain } from "../src/types";
export default {
  "chain": "TCH",
  "chainId": 7,
  "explorers": [
    {
      "name": "Thaichain Explorer",
      "url": "https://exp.thaichain.org",
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
  "infoURL": "https://thaichain.io",
  "name": "ThaiChain",
  "nativeCurrency": {
    "name": "ThaiChain Ether",
    "symbol": "TCH",
    "decimals": 18
  },
  "networkId": 7,
  "rpc": [
    "https://7.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dome.cloud",
    "https://rpc.thaichain.org"
  ],
  "shortName": "tch",
  "slug": "thaichain",
  "testnet": false
} as const satisfies Chain;