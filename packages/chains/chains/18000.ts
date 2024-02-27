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
  "infoURL": "https://goexosphere.com",
  "name": "Frontier of Dreams Testnet",
  "nativeCurrency": {
    "name": "ZKST",
    "symbol": "ZKST",
    "decimals": 18
  },
  "networkId": 18000,
  "rpc": [
    "https://18000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fod.games/"
  ],
  "shortName": "ZKST",
  "slip44": 1,
  "slug": "frontier-of-dreams-testnet",
  "testnet": true
} as const satisfies Chain;