export default {
  "name": "IVAR Chain Testnet",
  "chain": "IVAR",
  "icon": {
    "url": "ipfs://QmV8UmSwqGF2fxrqVEBTHbkyZueahqyYtkfH2RBF5pNysM",
    "width": 519,
    "height": 519,
    "format": "svg"
  },
  "rpc": [
    "https://ivar-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.ivarex.com"
  ],
  "faucets": [
    "https://tfaucet.ivarex.com/"
  ],
  "nativeCurrency": {
    "name": "tIvar",
    "symbol": "tIVAR",
    "decimals": 18
  },
  "infoURL": "https://ivarex.com",
  "shortName": "tivar",
  "chainId": 16888,
  "networkId": 16888,
  "explorers": [
    {
      "name": "ivarscan",
      "url": "https://testnet.ivarscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ivar-chain-testnet"
} as const;