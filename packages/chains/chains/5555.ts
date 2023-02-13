export default {
  "name": "Chain Verse Mainnet",
  "chain": "CVERSE",
  "icon": {
    "url": "ipfs://QmQyJt28h4wN3QHPXUQJQYQqGiFUD77han3zibZPzHbitk",
    "width": 1000,
    "height": 1436,
    "format": "png"
  },
  "rpc": [
    "https://chain-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chainverse.info"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Oasys",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://chainverse.info",
  "shortName": "cverse",
  "chainId": 5555,
  "networkId": 5555,
  "explorers": [
    {
      "name": "Chain Verse Explorer",
      "url": "https://explorer.chainverse.info",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "chain-verse"
} as const;