export default {
  "name": "Vention Smart Chain Mainnet",
  "chain": "VSC",
  "icon": {
    "url": "ipfs://QmcNepHmbmHW1BZYM3MFqJW4awwhmDqhUPRXXmRnXwg1U4",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "rpc": [
    "https://vention-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.vention.network"
  ],
  "faucets": [
    "https://faucet.vention.network"
  ],
  "nativeCurrency": {
    "name": "VNT",
    "symbol": "VNT",
    "decimals": 18
  },
  "infoURL": "https://ventionscan.io",
  "shortName": "vscm",
  "chainId": 77612,
  "networkId": 77612,
  "explorers": [
    {
      "name": "ventionscan",
      "url": "https://ventionscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "vention-smart-chain"
} as const;