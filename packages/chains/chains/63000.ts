import type { Chain } from "../src/types";
export default {
  "chainId": 63000,
  "chain": "ECS",
  "name": "eCredits Mainnet",
  "rpc": [
    "https://ecredits.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ecredits.com"
  ],
  "slug": "ecredits",
  "icon": {
    "url": "ipfs://QmU9H9JE1KtLh2Fxrd8EWTMjKGJBpgRWKUeEx7u6ic4kBY",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "infoURL": "https://ecredits.com",
  "shortName": "ecs",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "eCredits MainNet Explorer",
      "url": "https://explorer.ecredits.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;