import type { Chain } from "../types";
export default {
  "chain": "EXL",
  "chainId": 27082022,
  "explorers": [
    {
      "name": "exlscan",
      "url": "https://exlscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmeooM7QicT1YbgY93XPd5p7JsCjYhN3qjWt68X57g6bVC",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeooM7QicT1YbgY93XPd5p7JsCjYhN3qjWt68X57g6bVC",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "name": "Excoincial Chain Mainnet",
  "nativeCurrency": {
    "name": "Exlcoin",
    "symbol": "EXL",
    "decimals": 18
  },
  "networkId": 27082022,
  "rpc": [
    "https://excoincial-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://27082022.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.exlscan.com"
  ],
  "shortName": "exl",
  "slug": "excoincial-chain",
  "testnet": false
} as const satisfies Chain;