export default {
  "name": "Tipboxcoin Testnet",
  "chain": "TPBX",
  "icon": {
    "url": "ipfs://QmbiaHnR3fVVofZ7Xq2GYZxwHkLEy3Fh5qDtqnqXD6ACAh",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "rpc": [
    "https://tipboxcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.tipboxcoin.net"
  ],
  "faucets": [
    "https://faucet.tipboxcoin.net"
  ],
  "nativeCurrency": {
    "name": "Tipboxcoin",
    "symbol": "TPBX",
    "decimals": 18
  },
  "infoURL": "https://tipboxcoin.net",
  "shortName": "TPBXt",
  "chainId": 4141,
  "networkId": 4141,
  "explorers": [
    {
      "name": "Tipboxcoin",
      "url": "https://testnet.tipboxcoin.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "tipboxcoin-testnet"
} as const;