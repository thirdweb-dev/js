import type { Chain } from "../src/types";
export default {
  "chainId": 8000,
  "chain": "Teleport",
  "name": "Teleport",
  "rpc": [
    "https://teleport.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.teleport.network"
  ],
  "slug": "teleport",
  "icon": {
    "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
    "width": 390,
    "height": 390,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Tele",
    "symbol": "TELE",
    "decimals": 18
  },
  "infoURL": "https://teleport.network",
  "shortName": "teleport",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Teleport Cosmos Explorer (Big Dipper)",
      "url": "https://explorer.teleport.network",
      "standard": "none"
    },
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.teleport.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;