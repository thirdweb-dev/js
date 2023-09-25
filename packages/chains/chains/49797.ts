import type { Chain } from "../src/types";
export default {
  "chainId": 49797,
  "chain": "NRG",
  "name": "Energi Testnet",
  "rpc": [
    "https://energi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodeapi.test.energi.network"
  ],
  "slug": "energi-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Energi",
    "symbol": "NRG",
    "decimals": 18
  },
  "infoURL": "https://www.energi.world/",
  "shortName": "tnrg",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;