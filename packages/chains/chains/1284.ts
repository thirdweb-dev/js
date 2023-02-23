export default {
  "name": "Moonbeam",
  "chain": "MOON",
  "rpc": [
    "https://moonbeam.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbeam.network",
    "wss://wss.api.moonbeam.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Glimmer",
    "symbol": "GLMR",
    "decimals": 18
  },
  "infoURL": "https://moonbeam.network/networks/moonbeam/",
  "shortName": "mbeam",
  "chainId": 1284,
  "networkId": 1284,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbeam.moonscan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "moonbeam"
} as const;