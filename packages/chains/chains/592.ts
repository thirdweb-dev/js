export default {
  "name": "Astar",
  "chain": "ASTR",
  "rpc": [
    "https://astar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.astar.network:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Astar",
    "symbol": "ASTR",
    "decimals": 18
  },
  "infoURL": "https://astar.network/",
  "shortName": "astr",
  "chainId": 592,
  "networkId": 592,
  "icon": {
    "url": "ipfs://Qmdvmx3p6gXBCLUMU1qivscaTNkT6h3URdhUTZCHLwKudg",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "explorers": [
    {
      "name": "subscan",
      "url": "https://astar.subscan.io",
      "standard": "none",
      "icon": "subscan"
    }
  ],
  "testnet": false,
  "slug": "astar"
} as const;