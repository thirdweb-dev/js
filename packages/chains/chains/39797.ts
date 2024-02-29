import type { Chain } from "../src/types";
export default {
  "chain": "NRG",
  "chainId": 39797,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.energi.world/",
  "name": "Energi Mainnet",
  "nativeCurrency": {
    "name": "Energi",
    "symbol": "NRG",
    "decimals": 18
  },
  "networkId": 39797,
  "rpc": [
    "https://39797.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nodeapi.energi.network"
  ],
  "shortName": "nrg",
  "slip44": 39797,
  "slug": "energi",
  "testnet": false
} as const satisfies Chain;