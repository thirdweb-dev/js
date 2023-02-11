export default {
  "name": "Moonbase Alpha",
  "chain": "MOON",
  "rpc": [
    "https://moonbase-alpha.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbase.moonbeam.network",
    "wss://wss.api.moonbase.moonbeam.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dev",
    "symbol": "DEV",
    "decimals": 18
  },
  "infoURL": "https://docs.moonbeam.network/networks/testnet/",
  "shortName": "mbase",
  "chainId": 1287,
  "networkId": 1287,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbase.moonscan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "moonbase-alpha"
} as const;