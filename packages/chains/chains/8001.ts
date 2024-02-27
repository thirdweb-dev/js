import type { Chain } from "../src/types";
export default {
  "chain": "Teleport",
  "chainId": 8001,
  "explorers": [
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.testnet.teleport.network",
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
      "url": "https://explorer.testnet.teleport.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
        "width": 390,
        "height": 390,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://chain-docs.teleport.network/testnet/faucet.html"
  ],
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
  "networkId": 8001,
  "rpc": [
    "https://8001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.testnet.teleport.network"
  ],
  "shortName": "teleport-testnet",
  "slip44": 1,
  "slug": "teleport-testnet",
  "testnet": true
} as const satisfies Chain;