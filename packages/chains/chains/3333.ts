export default {
  "name": "Web3Q Testnet",
  "chain": "Web3Q",
  "rpc": [
    "https://web3q-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.web3q.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://testnet.web3q.io/home.w3q/",
  "shortName": "w3q-t",
  "chainId": 3333,
  "networkId": 3333,
  "explorers": [
    {
      "name": "w3q-testnet",
      "url": "https://explorer.testnet.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "web3q-testnet"
} as const;