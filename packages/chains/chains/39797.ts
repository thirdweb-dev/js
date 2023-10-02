import type { Chain } from "../src/types";
export default {
  "chain": "NRG",
  "chainId": 39797,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.energi.world/",
  "name": "Energi Mainnet",
  "nativeCurrency": {
    "name": "Energi",
    "symbol": "NRG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://energi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodeapi.energi.network"
  ],
  "shortName": "nrg",
  "slug": "energi",
  "testnet": false
} as const satisfies Chain;