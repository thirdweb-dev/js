import type { Chain } from "../types";
export default {
  "chain": "Teleport",
  "chainId": 8000,
  "explorers": [
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.teleport.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
        "width": 390,
        "height": 390,
        "format": "svg"
      }
    },
    {
      "name": "Teleport Cosmos Explorer (Big Dipper)",
      "url": "https://explorer.teleport.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
        "width": 390,
        "height": 390,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
    "width": 390,
    "height": 390,
    "format": "svg"
  },
  "infoURL": "https://teleport.network",
  "name": "Teleport",
  "nativeCurrency": {
    "name": "Tele",
    "symbol": "TELE",
    "decimals": 18
  },
  "networkId": 8000,
  "rpc": [
    "https://teleport.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.teleport.network"
  ],
  "shortName": "teleport",
  "slug": "teleport",
  "testnet": false
} as const satisfies Chain;