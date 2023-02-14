export default {
  "name": "Huobi ECO Chain Testnet",
  "chain": "Heco",
  "rpc": [
    "https://huobi-eco-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.hecochain.com",
    "wss://ws-testnet.hecochain.com"
  ],
  "faucets": [
    "https://scan-testnet.hecochain.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Huobi ECO Chain Test Native Token",
    "symbol": "htt",
    "decimals": 18
  },
  "infoURL": "https://testnet.hecoinfo.com",
  "shortName": "hecot",
  "chainId": 256,
  "networkId": 256,
  "testnet": true,
  "slug": "huobi-eco-chain-testnet"
} as const;