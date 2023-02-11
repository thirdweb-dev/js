export default {
  "name": "Openpiece Testnet",
  "chain": "OPENPIECE",
  "icon": {
    "url": "ipfs://QmVTahJkdSH3HPYsJMK2GmqfWZjLyxE7cXy1aHEnHU3vp2",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "rpc": [
    "https://openpiece-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.openpiece.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Belly",
    "symbol": "BELLY",
    "decimals": 18
  },
  "infoURL": "https://cryptopiece.online",
  "shortName": "OPtest",
  "chainId": 141,
  "networkId": 141,
  "explorers": [
    {
      "name": "Belly Scan",
      "url": "https://testnet.bellyscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "openpiece-testnet"
} as const;