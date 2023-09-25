import type { Chain } from "../src/types";
export default {
  "chainId": 63001,
  "chain": "ECS",
  "name": "eCredits Testnet",
  "rpc": [
    "https://ecredits-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tst.ecredits.com"
  ],
  "slug": "ecredits-testnet",
  "icon": {
    "url": "ipfs://QmU9H9JE1KtLh2Fxrd8EWTMjKGJBpgRWKUeEx7u6ic4kBY",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "faucets": [
    "https://faucet.tst.ecredits.com"
  ],
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "infoURL": "https://ecredits.com",
  "shortName": "ecs-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "eCredits TestNet Explorer",
      "url": "https://explorer.tst.ecredits.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;