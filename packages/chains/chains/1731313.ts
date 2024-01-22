import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1731313,
  "explorers": [],
  "faucets": [],
  "name": "Turkey Demo Dev",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1731313,
  "rpc": [
    "https://turkey-demo-dev.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1731313.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devchain-poa.huabeizhenxuan.com"
  ],
  "shortName": "TDD",
  "slug": "turkey-demo-dev",
  "testnet": false
} as const satisfies Chain;