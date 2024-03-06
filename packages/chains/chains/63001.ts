import type { Chain } from "../src/types";
export default {
  "chain": "ECS",
  "chainId": 63001,
  "explorers": [
    {
      "name": "eCredits TestNet Explorer",
      "url": "https://explorer.tst.ecredits.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmU9H9JE1KtLh2Fxrd8EWTMjKGJBpgRWKUeEx7u6ic4kBY",
        "width": 32,
        "height": 32,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.tst.ecredits.com"
  ],
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
  "networkId": 63001,
  "rpc": [
    "https://63001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tst.ecredits.com"
  ],
  "shortName": "ecs-testnet",
  "slip44": 1,
  "slug": "ecredits-testnet",
  "testnet": true
} as const satisfies Chain;