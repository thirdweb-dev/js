export default {
  "name": "Teleport Testnet",
  "chain": "Teleport",
  "rpc": [
    "https://teleport-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.testnet.teleport.network"
  ],
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
  "chainId": 8001,
  "networkId": 8001,
  "icon": {
    "url": "ipfs://QmdP1sLnsmW9dwnfb1GxAXU1nHDzCvWBQNumvMXpdbCSuz",
    "width": 390,
    "height": 390,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.testnet.teleport.network",
      "standard": "none",
      "icon": "teleport"
    },
    {
      "name": "Teleport Cosmos Explorer (Big Dipper)",
      "url": "https://explorer.testnet.teleport.network",
      "standard": "none",
      "icon": "teleport"
    }
  ],
  "testnet": true,
  "slug": "teleport-testnet"
} as const;