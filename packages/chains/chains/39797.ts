import type { Chain } from "../src/types";
export default {
  "chainId": 39797,
  "chain": "NRG",
  "name": "Energi Mainnet",
  "rpc": [
    "https://energi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodeapi.energi.network"
  ],
  "slug": "energi",
  "faucets": [],
  "nativeCurrency": {
    "name": "Energi",
    "symbol": "NRG",
    "decimals": 18
  },
  "infoURL": "https://www.energi.world/",
  "shortName": "nrg",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;