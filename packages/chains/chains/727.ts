import type { Chain } from "../src/types";
export default {
  "chain": "BLU",
  "chainId": 727,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.blucrates.com",
  "name": "Blucrates",
  "nativeCurrency": {
    "name": "Blucrates",
    "symbol": "BLU",
    "decimals": 18
  },
  "networkId": 727,
  "rpc": [
    "https://blucrates.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://727.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data.bluchain.pro"
  ],
  "shortName": "blu",
  "slip44": 727,
  "slug": "blucrates",
  "testnet": false
} as const satisfies Chain;