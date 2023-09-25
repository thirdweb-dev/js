import type { Chain } from "../src/types";
export default {
  "chainId": 43288,
  "chain": "Boba Avax",
  "name": "Boba Avax",
  "rpc": [
    "https://boba-avax.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avax.boba.network",
    "wss://wss.avax.boba.network",
    "https://replica.avax.boba.network",
    "wss://replica-wss.avax.boba.network"
  ],
  "slug": "boba-avax",
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://docs.boba.network/for-developers/network-avalanche",
  "shortName": "bobaavax",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Boba Avax Explorer",
      "url": "https://blockexplorer.avax.boba.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;