export default {
  "name": "TomoChain Testnet",
  "chain": "TOMO",
  "rpc": [
    "https://tomochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tomochain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "infoURL": "https://tomochain.com",
  "shortName": "tomot",
  "chainId": 89,
  "networkId": 89,
  "slip44": 889,
  "testnet": true,
  "slug": "tomochain-testnet"
} as const;