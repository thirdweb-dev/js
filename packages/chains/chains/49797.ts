import type { Chain } from "../src/types";
export default {
  "chain": "NRG",
  "chainId": 49797,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.energi.world/",
  "name": "Energi Testnet",
  "nativeCurrency": {
    "name": "Energi",
    "symbol": "NRG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://energi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodeapi.test.energi.network"
  ],
  "shortName": "tnrg",
  "slug": "energi-testnet",
  "testnet": true
} as const satisfies Chain;