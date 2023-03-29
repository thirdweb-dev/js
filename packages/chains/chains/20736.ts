export default {
  "name": "P12 Chain",
  "chain": "P12",
  "icon": {
    "url": "ipfs://bafkreieiro4imoujeewc4r4thf5hxj47l56j2iwuz6d6pdj6ieb6ub3h7e",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://p12-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-chain.p12.games"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Hooked P2",
    "symbol": "hP2",
    "decimals": 18
  },
  "infoURL": "https://p12.network",
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "shortName": "p12",
  "chainId": 20736,
  "networkId": 20736,
  "explorers": [
    {
      "name": "P12 Chain Explorer",
      "url": "https://explorer.p12.games",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "p12-chain"
} as const;