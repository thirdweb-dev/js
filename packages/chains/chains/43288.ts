import type { Chain } from "../src/types";
export default {
  "name": "Boba Avax",
  "chain": "Boba Avax",
  "rpc": [
    "https://boba-avax.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avax.boba.network",
    "wss://wss.avax.boba.network",
    "https://replica.avax.boba.network",
    "wss://replica-wss.avax.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://docs.boba.network/for-developers/network-avalanche",
  "shortName": "bobaavax",
  "chainId": 43288,
  "networkId": 43288,
  "explorers": [
    {
      "name": "Boba Avax Explorer",
      "url": "https://blockexplorer.avax.boba.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "boba-avax"
} as const satisfies Chain;