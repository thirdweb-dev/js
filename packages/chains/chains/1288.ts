export default {
  "name": "Moonrock",
  "chain": "MOON",
  "rpc": [
    "https://moonrock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonrock.moonbeam.network",
    "wss://wss.api.moonrock.moonbeam.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rocs",
    "symbol": "ROC",
    "decimals": 18
  },
  "infoURL": "https://docs.moonbeam.network/learn/platform/networks/overview/",
  "shortName": "mrock",
  "chainId": 1288,
  "networkId": 1288,
  "testnet": false,
  "slug": "moonrock"
} as const;