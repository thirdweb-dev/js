import type { Chain } from "../src/types";
export default {
  "chain": "Boba Avax",
  "chainId": 43288,
  "explorers": [
    {
      "name": "Boba Avax Explorer",
      "url": "https://blockexplorer.avax.boba.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.boba.network/for-developers/network-avalanche",
  "name": "Boba Avax",
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "networkId": 43288,
  "rpc": [
    "https://boba-avax.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://43288.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://avax.boba.network",
    "wss://wss.avax.boba.network",
    "https://replica.avax.boba.network",
    "wss://replica-wss.avax.boba.network"
  ],
  "shortName": "bobaavax",
  "slug": "boba-avax",
  "testnet": false
} as const satisfies Chain;