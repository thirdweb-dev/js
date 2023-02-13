export default {
  "name": "IoTeX Network Testnet",
  "chain": "iotex.io",
  "rpc": [
    "https://iotex-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://babel-api.testnet.iotex.io"
  ],
  "faucets": [
    "https://faucet.iotex.io/"
  ],
  "nativeCurrency": {
    "name": "IoTeX",
    "symbol": "IOTX",
    "decimals": 18
  },
  "infoURL": "https://iotex.io",
  "shortName": "iotex-testnet",
  "chainId": 4690,
  "networkId": 4690,
  "explorers": [
    {
      "name": "testnet iotexscan",
      "url": "https://testnet.iotexscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "iotex-network-testnet"
} as const;