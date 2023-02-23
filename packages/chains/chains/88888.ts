export default {
  "name": "IVAR Chain Mainnet",
  "chain": "IVAR",
  "icon": {
    "url": "ipfs://QmV8UmSwqGF2fxrqVEBTHbkyZueahqyYtkfH2RBF5pNysM",
    "width": 519,
    "height": 519,
    "format": "svg"
  },
  "rpc": [
    "https://ivar-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.ivarex.com"
  ],
  "faucets": [
    "https://faucet.ivarex.com/"
  ],
  "nativeCurrency": {
    "name": "Ivar",
    "symbol": "IVAR",
    "decimals": 18
  },
  "infoURL": "https://ivarex.com",
  "shortName": "ivar",
  "chainId": 88888,
  "networkId": 88888,
  "explorers": [
    {
      "name": "ivarscan",
      "url": "https://ivarscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ivar-chain"
} as const;