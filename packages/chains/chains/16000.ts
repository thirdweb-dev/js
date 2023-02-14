export default {
  "name": "MetaDot Mainnet",
  "chain": "MTT",
  "rpc": [
    "https://metadot.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.metadot.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MetaDot Token",
    "symbol": "MTT",
    "decimals": 18
  },
  "infoURL": "https://metadot.network",
  "shortName": "mtt",
  "chainId": 16000,
  "networkId": 16000,
  "testnet": false,
  "slug": "metadot"
} as const;