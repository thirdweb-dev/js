export default {
  "name": "Metadium Testnet",
  "chain": "META",
  "rpc": [
    "https://metadium-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metadium.com/dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metadium Testnet Ether",
    "symbol": "KAL",
    "decimals": 18
  },
  "infoURL": "https://metadium.com",
  "shortName": "kal",
  "chainId": 12,
  "networkId": 12,
  "testnet": true,
  "slug": "metadium-testnet"
} as const;