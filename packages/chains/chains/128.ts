export default {
  "name": "Huobi ECO Chain Mainnet",
  "chain": "Heco",
  "rpc": [
    "https://huobi-eco-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.hecochain.com",
    "wss://ws-mainnet.hecochain.com"
  ],
  "faucets": [
    "https://free-online-app.com/faucet-for-eth-evm-chains/"
  ],
  "nativeCurrency": {
    "name": "Huobi ECO Chain Native Token",
    "symbol": "HT",
    "decimals": 18
  },
  "infoURL": "https://www.hecochain.com",
  "shortName": "heco",
  "chainId": 128,
  "networkId": 128,
  "slip44": 1010,
  "explorers": [
    {
      "name": "hecoinfo",
      "url": "https://hecoinfo.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "huobi-eco-chain"
} as const;