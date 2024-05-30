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