import type { Chain } from "../src/types";
export default {
  "chain": "META",
  "chainId": 11,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://metadium.com",
  "name": "Metadium Mainnet",
  "nativeCurrency": {
    "name": "Metadium Mainnet Ether",
    "symbol": "META",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://metadium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metadium.com/prod"
  ],
  "shortName": "meta",
  "slug": "metadium",
  "testnet": false
} as const satisfies Chain;