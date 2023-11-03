import type { Chain } from "../types";
export default {
  "chain": "ECS",
  "chainId": 63000,
  "explorers": [
    {
      "name": "eCredits MainNet Explorer",
      "url": "https://explorer.ecredits.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmU9H9JE1KtLh2Fxrd8EWTMjKGJBpgRWKUeEx7u6ic4kBY",
        "width": 32,
        "height": 32,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmU9H9JE1KtLh2Fxrd8EWTMjKGJBpgRWKUeEx7u6ic4kBY",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "infoURL": "https://ecredits.com",
  "name": "eCredits Mainnet",
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "networkId": 63000,
  "rpc": [
    "https://ecredits.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://63000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ecredits.com"
  ],
  "shortName": "ecs",
  "slug": "ecredits",
  "testnet": false
} as const satisfies Chain;