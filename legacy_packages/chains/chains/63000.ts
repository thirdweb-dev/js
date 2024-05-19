import type { Chain } from "../src/types";
export default {
  "chain": "ECS",
  "chainId": 63000,
  "explorers": [
    {
      "name": "eCredits MainNet Explorer",
      "url": "https://explorer.ecredits.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ecredits.com",
  "name": "eCredits Mainnet",
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "networkId": 63000,
  "rpc": [
    "https://63000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ecredits.com"
  ],
  "shortName": "ecs",
  "slug": "ecredits",
  "testnet": false
} as const satisfies Chain;