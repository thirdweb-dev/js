export default {
  "name": "Excoincial Chain Volta-Testnet",
  "chain": "TEXL",
  "icon": {
    "url": "ipfs://QmeooM7QicT1YbgY93XPd5p7JsCjYhN3qjWt68X57g6bVC",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://excoincial-chain-volta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.exlscan.com"
  ],
  "faucets": [
    "https://faucet.exlscan.com"
  ],
  "nativeCurrency": {
    "name": "TExlcoin",
    "symbol": "TEXL",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "exlvolta",
  "chainId": 27082017,
  "networkId": 27082017,
  "explorers": [
    {
      "name": "exlscan",
      "url": "https://testnet-explorer.exlscan.com",
      "icon": "exl",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "excoincial-chain-volta-testnet"
} as const;