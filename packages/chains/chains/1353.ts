export default {
  "name": "CIC Chain Mainnet",
  "chain": "CIC",
  "rpc": [
    "https://cic-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xapi.cicscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Crazy Internet Coin",
    "symbol": "CIC",
    "decimals": 18
  },
  "infoURL": "https://www.cicchain.net",
  "shortName": "CIC",
  "chainId": 1353,
  "networkId": 1353,
  "icon": {
    "url": "ipfs://QmNekc5gpyrQkeDQcmfJLBrP5fa6GMarB13iy6aHVdQJDU",
    "width": 1024,
    "height": 768,
    "format": "png"
  },
  "explorers": [
    {
      "name": "CICscan",
      "url": "https://cicscan.com",
      "icon": "cicchain",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "cic-chain"
} as const;