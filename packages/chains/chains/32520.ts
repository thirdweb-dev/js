export default {
  "name": "Bitgert Mainnet",
  "chain": "Brise",
  "rpc": [
    "https://bitgert.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.icecreamswap.com",
    "https://mainnet-rpc.brisescan.com",
    "https://chainrpc.com",
    "https://serverrpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitrise Token",
    "symbol": "Brise",
    "decimals": 18
  },
  "infoURL": "https://bitgert.com/",
  "shortName": "Brise",
  "chainId": 32520,
  "networkId": 32520,
  "icon": {
    "url": "ipfs://QmY3vKe1rG9AyHSGH1ouP3ER3EVUZRtRrFbFZEfEpMSd4V",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Brise Scan",
      "url": "https://brisescan.com",
      "icon": "brise",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bitgert"
} as const;