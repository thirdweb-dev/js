export default {
  "name": "GTON Testnet",
  "chain": "GTON Testnet",
  "rpc": [
    "https://gton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gton.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GCD",
    "symbol": "GCD",
    "decimals": 18
  },
  "infoURL": "https://gton.capital",
  "shortName": "tgton",
  "chainId": 50021,
  "networkId": 50021,
  "explorers": [
    {
      "name": "GTON Testnet Network Explorer",
      "url": "https://explorer.testnet.gton.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-3"
  },
  "testnet": true,
  "slug": "gton-testnet"
} as const;