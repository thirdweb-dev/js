import type { Chain } from "../src/types";
export default {
  "chainId": 18000,
  "chain": "Game Network",
  "name": "Frontier of Dreams Testnet",
  "rpc": [
    "https://frontier-of-dreams-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fod.games/"
  ],
  "slug": "frontier-of-dreams-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "ZKST",
    "symbol": "ZKST",
    "decimals": 18
  },
  "infoURL": "https://goexosphere.com",
  "shortName": "ZKST",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Game Network",
      "url": "https://explorer.fod.games",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;