export default {
  "name": "Openpiece Mainnet",
  "chain": "OPENPIECE",
  "icon": {
    "url": "ipfs://QmVTahJkdSH3HPYsJMK2GmqfWZjLyxE7cXy1aHEnHU3vp2",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "rpc": [
    "https://openpiece.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.openpiece.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Belly",
    "symbol": "BELLY",
    "decimals": 18
  },
  "infoURL": "https://cryptopiece.online",
  "shortName": "OP",
  "chainId": 54,
  "networkId": 54,
  "explorers": [
    {
      "name": "Belly Scan",
      "url": "https://bellyscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "openpiece"
} as const;