export default {
  "name": "GTON Mainnet",
  "chain": "GTON",
  "rpc": [
    "https://gton.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gton.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GCD",
    "symbol": "GCD",
    "decimals": 18
  },
  "infoURL": "https://gton.capital",
  "shortName": "gton",
  "chainId": 1000,
  "networkId": 1000,
  "explorers": [
    {
      "name": "GTON Network Explorer",
      "url": "https://explorer.gton.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "testnet": false,
  "slug": "gton"
} as const;