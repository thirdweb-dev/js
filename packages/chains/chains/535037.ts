export default {
  "name": "BeanEco SmartChain",
  "title": "BESC Mainnet",
  "chain": "BESC",
  "rpc": [
    "https://beaneco-smartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.bescscan.io"
  ],
  "faucets": [
    "faucet.bescscan.ion"
  ],
  "nativeCurrency": {
    "name": "BeanEco SmartChain",
    "symbol": "BESC",
    "decimals": 18
  },
  "infoURL": "besceco.finance",
  "shortName": "BESC",
  "chainId": 535037,
  "networkId": 535037,
  "explorers": [
    {
      "name": "bescscan",
      "url": "https://Bescscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "beaneco-smartchain"
} as const;