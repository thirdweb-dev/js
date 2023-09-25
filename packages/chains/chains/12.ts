import type { Chain } from "../src/types";
export default {
  "chainId": 12,
  "chain": "META",
  "name": "Metadium Testnet",
  "rpc": [
    "https://metadium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metadium.com/dev"
  ],
  "slug": "metadium-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Metadium Testnet Ether",
    "symbol": "KAL",
    "decimals": 18
  },
  "infoURL": "https://metadium.com",
  "shortName": "kal",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;