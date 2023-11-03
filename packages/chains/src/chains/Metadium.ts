import type { Chain } from "../types";
export default {
  "chain": "META",
  "chainId": 11,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://metadium.com",
  "name": "Metadium Mainnet",
  "nativeCurrency": {
    "name": "Metadium Mainnet Ether",
    "symbol": "META",
    "decimals": 18
  },
  "networkId": 11,
  "rpc": [
    "https://metadium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://11.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metadium.com/prod"
  ],
  "shortName": "meta",
  "slip44": 916,
  "slug": "metadium",
  "testnet": false
} as const satisfies Chain;