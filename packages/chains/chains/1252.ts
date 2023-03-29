export default {
  "name": "CIC Chain Testnet",
  "chain": "CICT",
  "rpc": [
    "https://cic-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testapi.cicscan.com"
  ],
  "faucets": [
    "https://cicfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Crazy Internet Coin",
    "symbol": "CICT",
    "decimals": 18
  },
  "infoURL": "https://www.cicchain.net",
  "shortName": "CICT",
  "chainId": 1252,
  "networkId": 1252,
  "icon": {
    "url": "ipfs://QmNekc5gpyrQkeDQcmfJLBrP5fa6GMarB13iy6aHVdQJDU",
    "width": 1024,
    "height": 768,
    "format": "png"
  },
  "explorers": [
    {
      "name": "CICscan",
      "url": "https://testnet.cicscan.com",
      "icon": "cicchain",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "cic-chain-testnet"
} as const;