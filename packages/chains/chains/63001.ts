import type { Chain } from "../src/types";
export default {
  "chain": "ECS",
  "chainId": 63001,
  "explorers": [
    {
      "name": "eCredits TestNet Explorer",
      "url": "https://explorer.tst.ecredits.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.tst.ecredits.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmU9H9JE1KtLh2Fxrd8EWTMjKGJBpgRWKUeEx7u6ic4kBY",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "infoURL": "https://ecredits.com",
  "name": "eCredits Testnet",
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ecredits-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tst.ecredits.com"
  ],
  "shortName": "ecs-testnet",
  "slug": "ecredits-testnet",
  "testnet": true
} as const satisfies Chain;