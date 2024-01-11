import type { Chain } from "../src/types";
export default {
  "chain": "META",
  "chainId": 12,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://metadium.com",
  "name": "Metadium Testnet",
  "nativeCurrency": {
    "name": "Metadium Testnet Ether",
    "symbol": "KAL",
    "decimals": 18
  },
  "networkId": 12,
  "rpc": [
    "https://metadium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://12.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metadium.com/dev"
  ],
  "shortName": "kal",
  "slip44": 1,
  "slug": "metadium-testnet",
  "testnet": true
} as const satisfies Chain;