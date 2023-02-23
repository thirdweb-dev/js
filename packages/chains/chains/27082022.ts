export default {
  "name": "Excoincial Chain Mainnet",
  "chain": "EXL",
  "icon": {
    "url": "ipfs://QmeooM7QicT1YbgY93XPd5p7JsCjYhN3qjWt68X57g6bVC",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://excoincial-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.exlscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Exlcoin",
    "symbol": "EXL",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "exl",
  "chainId": 27082022,
  "networkId": 27082022,
  "explorers": [
    {
      "name": "exlscan",
      "url": "https://exlscan.com",
      "icon": "exl",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "excoincial-chain"
} as const;