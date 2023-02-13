export default {
  "name": "omChain Mainnet",
  "chain": "OML",
  "icon": {
    "url": "ipfs://QmQtEHaejiDbmiCvbBYw9jNQv3DLK5XHCQwLRfnLNpdN5j",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://omchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed.omchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "omChain",
    "symbol": "OMC",
    "decimals": 18
  },
  "infoURL": "https://omchain.io",
  "shortName": "omc",
  "chainId": 21816,
  "networkId": 21816,
  "explorers": [
    {
      "name": "omChain Explorer",
      "url": "https://explorer.omchain.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "omchain"
} as const;