import type { Chain } from "../src/types";
export default {
  "chain": "Teleport",
  "chainId": 8001,
  "explorers": [
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.testnet.teleport.network",
      "standard": "none"
    },
    {
      "name": "Teleport Cosmos Explorer (Big Dipper)",
      "url": "https://explorer.testnet.teleport.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://chain-docs.teleport.network/testnet/faucet.html"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
    "width": 390,
    "height": 390,
    "format": "svg"
  },
  "infoURL": "https://teleport.network",
  "name": "Teleport Testnet",
  "nativeCurrency": {
    "name": "Tele",
    "symbol": "TELE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://teleport-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.testnet.teleport.network"
  ],
  "shortName": "teleport-testnet",
  "slug": "teleport-testnet",
  "testnet": true
} as const satisfies Chain;