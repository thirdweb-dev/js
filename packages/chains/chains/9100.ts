export default {
  "name": "Genesis Coin",
  "chain": "Genesis",
  "rpc": [
    "https://genesis-coin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://genesis-gn.com",
    "wss://genesis-gn.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GN Coin",
    "symbol": "GNC",
    "decimals": 18
  },
  "infoURL": "https://genesis-gn.com",
  "shortName": "GENEC",
  "chainId": 9100,
  "networkId": 9100,
  "testnet": false,
  "slug": "genesis-coin"
} as const;