import type { Chain } from "../src/types";
export default {
  "chain": "NRG",
  "chainId": 49797,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.energi.world/",
  "name": "Energi Testnet",
  "nativeCurrency": {
    "name": "Energi",
    "symbol": "NRG",
    "decimals": 18
  },
  "networkId": 49797,
  "rpc": [
    "https://49797.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodeapi.test.energi.network"
  ],
  "shortName": "tnrg",
  "slip44": 1,
  "slug": "energi-testnet",
  "testnet": true
} as const satisfies Chain;