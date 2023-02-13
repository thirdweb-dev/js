export default {
  "name": "Frenchain Testnet",
  "chain": "tfren",
  "rpc": [
    "https://frenchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-01tn.frenchain.app"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "tFREN",
    "symbol": "FtREN",
    "decimals": 18
  },
  "infoURL": "https://frenchain.app",
  "shortName": "tFREN",
  "chainId": 444,
  "networkId": 444,
  "icon": {
    "url": "ipfs://QmQk41bYX6WpYyUAdRgomZekxP5mbvZXhfxLEEqtatyJv4",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.frenscan.io",
      "icon": "fren",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "frenchain-testnet"
} as const;