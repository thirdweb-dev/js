export default {
  "name": "UB Smart Chain(testnet)",
  "chain": "USC",
  "rpc": [
    "https://ub-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.uschain.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "infoURL": "https://www.ubchain.site",
  "shortName": "usctest",
  "chainId": 99998,
  "networkId": 99998,
  "testnet": true,
  "slug": "ub-smart-chain-testnet"
} as const;