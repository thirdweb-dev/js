export default {
  "name": "Callisto Testnet",
  "chain": "CLO",
  "rpc": [
    "https://callisto-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.callisto.network/"
  ],
  "faucets": [
    "https://faucet.callisto.network/"
  ],
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "infoURL": "https://callisto.network",
  "shortName": "CLOTestnet",
  "chainId": 20729,
  "networkId": 79,
  "testnet": true,
  "slug": "callisto-testnet"
} as const;