export default {
  "name": "Lycan Chain",
  "chain": "LYC",
  "rpc": [
    "https://lycan-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lycanchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Lycan",
    "symbol": "LYC",
    "decimals": 18
  },
  "infoURL": "https://lycanchain.com",
  "shortName": "LYC",
  "chainId": 721,
  "networkId": 721,
  "icon": {
    "url": "ipfs://Qmc8hsCbUUjnJDnXrDhFh4V1xk1gJwZbUyNJ39p72javji",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.lycanchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "lycan-chain"
} as const;