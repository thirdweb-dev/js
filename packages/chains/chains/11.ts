import type { Chain } from "../src/types";
export default {
  "chainId": 11,
  "chain": "META",
  "name": "Metadium Mainnet",
  "rpc": [
    "https://metadium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metadium.com/prod"
  ],
  "slug": "metadium",
  "faucets": [],
  "nativeCurrency": {
    "name": "Metadium Mainnet Ether",
    "symbol": "META",
    "decimals": 18
  },
  "infoURL": "https://metadium.com",
  "shortName": "meta",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;