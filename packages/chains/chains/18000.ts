import type { Chain } from "../src/types";
export default {
  "chain": "Game Network",
  "chainId": 18000,
  "explorers": [
    {
      "name": "Game Network",
      "url": "https://explorer.fod.games",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://goexosphere.com",
  "name": "Frontier of Dreams Testnet",
  "nativeCurrency": {
    "name": "ZKST",
    "symbol": "ZKST",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://frontier-of-dreams-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fod.games/"
  ],
  "shortName": "ZKST",
  "slug": "frontier-of-dreams-testnet",
  "testnet": true
} as const satisfies Chain;