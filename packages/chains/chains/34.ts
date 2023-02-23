export default {
  "name": "Dithereum Testnet",
  "chain": "DTH",
  "icon": {
    "url": "ipfs://QmSHN5GtRGpMMpszSn1hF47ZSLRLqrLxWsQ48YYdJPyjLf",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "rpc": [
    "https://dithereum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-testnet.dithereum.io"
  ],
  "faucets": [
    "https://faucet.dithereum.org"
  ],
  "nativeCurrency": {
    "name": "Dither",
    "symbol": "DTH",
    "decimals": 18
  },
  "infoURL": "https://dithereum.org",
  "shortName": "dth",
  "chainId": 34,
  "networkId": 34,
  "testnet": true,
  "slug": "dithereum-testnet"
} as const;