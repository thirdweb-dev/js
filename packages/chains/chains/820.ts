export default {
  "name": "Callisto Mainnet",
  "chain": "CLO",
  "rpc": [
    "https://callisto.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.callisto.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "infoURL": "https://callisto.network",
  "shortName": "clo",
  "chainId": 820,
  "networkId": 1,
  "slip44": 820,
  "testnet": false,
  "slug": "callisto"
} as const;