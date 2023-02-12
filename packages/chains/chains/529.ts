export default {
  "name": "Firechain Mainnet",
  "chain": "FIRE",
  "icon": {
    "url": "ipfs://QmYjuztyURb3Fc6ZTLgCbwQa64CcVoigF5j9cafzuSbqgf",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://firechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rpc1.thefirechain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "infoURL": "https://thefirechain.com",
  "shortName": "fire",
  "chainId": 529,
  "networkId": 529,
  "explorers": [],
  "status": "incubating",
  "testnet": false,
  "slug": "firechain"
} as const;