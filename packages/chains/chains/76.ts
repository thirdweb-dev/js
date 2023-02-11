export default {
  "name": "Mix",
  "chain": "MIX",
  "rpc": [
    "https://mix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc2.mix-blockchain.org:8647"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mix Ether",
    "symbol": "MIX",
    "decimals": 18
  },
  "infoURL": "https://mix-blockchain.org",
  "shortName": "mix",
  "chainId": 76,
  "networkId": 76,
  "slip44": 76,
  "testnet": false,
  "slug": "mix"
} as const;