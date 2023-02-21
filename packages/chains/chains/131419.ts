export default {
  "name": "ETND Chain Mainnets",
  "chain": "ETND",
  "rpc": [
    "https://etnd-chain-s.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.node1.etnd.pro/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETND",
    "symbol": "ETND",
    "decimals": 18
  },
  "infoURL": "https://www.etnd.pro",
  "shortName": "ETND",
  "chainId": 131419,
  "networkId": 131419,
  "icon": {
    "url": "ipfs://Qmd26eRJxPb1jJg5Q4mC2M4kD9Jrs5vmcnr5LczHFMGwSD",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "explorers": [
    {
      "name": "etndscan",
      "url": "https://scan.etnd.pro",
      "icon": "ETND",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "etnd-chain-s"
} as const;