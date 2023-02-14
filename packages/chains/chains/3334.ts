export default {
  "name": "Web3Q Galileo",
  "chain": "Web3Q",
  "rpc": [
    "https://web3q-galileo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://galileo.web3q.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://galileo.web3q.io/home.w3q/",
  "shortName": "w3q-g",
  "chainId": 3334,
  "networkId": 3334,
  "explorers": [
    {
      "name": "w3q-galileo",
      "url": "https://explorer.galileo.web3q.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "web3q-galileo"
} as const;