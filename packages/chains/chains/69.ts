export default {
  "name": "Optimism Kovan",
  "title": "Optimism Testnet Kovan",
  "chain": "ETH",
  "rpc": [
    "https://optimism-kovan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kovan.optimism.io/"
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=69&address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Kovan Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://kovan-optimistic.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://optimism.io",
  "shortName": "okov",
  "chainId": 69,
  "networkId": 69,
  "testnet": true,
  "slug": "optimism-kovan"
} as const;