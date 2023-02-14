export default {
  "name": "Evmos",
  "chain": "Evmos",
  "rpc": [
    "https://evmos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.bd.evmos.org:8545",
    "https://evmos-evm.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Evmos",
    "symbol": "EVMOS",
    "decimals": 18
  },
  "infoURL": "https://evmos.org",
  "shortName": "evmos",
  "chainId": 9001,
  "networkId": 9001,
  "icon": {
    "url": "ipfs://QmeZW6VKUFTbz7PPW8PmDR3ZHa6osYPLBFPnW8T5LSU49c",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Evmos EVM Explorer (Escan)",
      "url": "https://escan.live",
      "standard": "none",
      "icon": "evmos"
    },
    {
      "name": "Evmos Cosmos Explorer (Mintscan)",
      "url": "https://www.mintscan.io/evmos",
      "standard": "none",
      "icon": "evmos"
    }
  ],
  "testnet": false,
  "slug": "evmos"
} as const;