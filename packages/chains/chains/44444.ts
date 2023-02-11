export default {
  "name": "Frenchain",
  "chain": "fren",
  "rpc": [
    "https://frenchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-02.frenscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FREN",
    "symbol": "FREN",
    "decimals": 18
  },
  "infoURL": "https://frenchain.app",
  "shortName": "FREN",
  "chainId": 44444,
  "networkId": 44444,
  "icon": {
    "url": "ipfs://QmQk41bYX6WpYyUAdRgomZekxP5mbvZXhfxLEEqtatyJv4",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://frenscan.io",
      "icon": "fren",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "frenchain"
} as const;