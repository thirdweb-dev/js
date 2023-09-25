import type { Chain } from "../src/types";
export default {
  "chainId": 8001,
  "chain": "Teleport",
  "name": "Teleport Testnet",
  "rpc": [
    "https://teleport-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.testnet.teleport.network"
  ],
  "slug": "teleport-testnet",
  "icon": {
    "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
    "width": 390,
    "height": 390,
    "format": "svg"
  },
  "faucets": [
    "https://chain-docs.teleport.network/testnet/faucet.html"
  ],
  "nativeCurrency": {
    "name": "Tele",
    "symbol": "TELE",
    "decimals": 18
  },
  "infoURL": "https://teleport.network",
  "shortName": "teleport-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Teleport Cosmos Explorer (Big Dipper)",
      "url": "https://explorer.testnet.teleport.network",
      "standard": "none"
    },
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.testnet.teleport.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;