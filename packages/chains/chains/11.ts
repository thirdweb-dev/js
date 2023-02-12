export default {
  "name": "Metadium Mainnet",
  "chain": "META",
  "rpc": [
    "https://metadium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metadium.com/prod"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metadium Mainnet Ether",
    "symbol": "META",
    "decimals": 18
  },
  "infoURL": "https://metadium.com",
  "shortName": "meta",
  "chainId": 11,
  "networkId": 11,
  "slip44": 916,
  "testnet": false,
  "slug": "metadium"
} as const;