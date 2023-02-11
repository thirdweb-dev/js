export default {
  "name": "Teleport",
  "chain": "Teleport",
  "rpc": [
    "https://teleport.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.teleport.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tele",
    "symbol": "TELE",
    "decimals": 18
  },
  "infoURL": "https://teleport.network",
  "shortName": "teleport",
  "chainId": 8000,
  "networkId": 8000,
  "icon": {
    "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
    "width": 390,
    "height": 390,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.teleport.network",
      "standard": "none",
      "icon": "teleport"
    },
    {
      "name": "Teleport Cosmos Explorer (Big Dipper)",
      "url": "https://explorer.teleport.network",
      "standard": "none",
      "icon": "teleport"
    }
  ],
  "testnet": false,
  "slug": "teleport"
} as const;