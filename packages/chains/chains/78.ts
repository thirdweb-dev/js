export default {
  "name": "PrimusChain mainnet",
  "chain": "PC",
  "rpc": [
    "https://primuschain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethnode.primusmoney.com/mainnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Primus Ether",
    "symbol": "PETH",
    "decimals": 18
  },
  "infoURL": "https://primusmoney.com",
  "shortName": "primuschain",
  "chainId": 78,
  "networkId": 78,
  "testnet": false,
  "slug": "primuschain"
} as const;