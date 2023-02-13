export default {
  "name": "Vention Smart Chain Testnet",
  "chain": "VSCT",
  "icon": {
    "url": "ipfs://QmcNepHmbmHW1BZYM3MFqJW4awwhmDqhUPRXXmRnXwg1U4",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "rpc": [
    "https://vention-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-testnet.vention.network"
  ],
  "faucets": [
    "https://faucet.vention.network"
  ],
  "nativeCurrency": {
    "name": "VNT",
    "symbol": "VNT",
    "decimals": 18
  },
  "infoURL": "https://testnet.ventionscan.io",
  "shortName": "vsct",
  "chainId": 741,
  "networkId": 741,
  "explorers": [
    {
      "name": "ventionscan",
      "url": "https://testnet.ventionscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "vention-smart-chain-testnet"
} as const;