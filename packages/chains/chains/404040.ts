export default {
  "name": "Tipboxcoin Mainnet",
  "chain": "TPBX",
  "icon": {
    "url": "ipfs://QmbiaHnR3fVVofZ7Xq2GYZxwHkLEy3Fh5qDtqnqXD6ACAh",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "rpc": [
    "https://tipboxcoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tipboxcoin.net"
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
  "shortName": "TPBXm",
  "chainId": 404040,
  "networkId": 404040,
  "explorers": [
    {
      "name": "Tipboxcoin",
      "url": "https://tipboxcoin.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "tipboxcoin"
} as const;