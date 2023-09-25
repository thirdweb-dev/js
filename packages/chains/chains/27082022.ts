import type { Chain } from "../src/types";
export default {
  "chainId": 27082022,
  "chain": "EXL",
  "name": "Excoincial Chain Mainnet",
  "rpc": [
    "https://excoincial-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.exlscan.com"
  ],
  "slug": "excoincial-chain",
  "icon": {
    "url": "ipfs://QmeooM7QicT1YbgY93XPd5p7JsCjYhN3qjWt68X57g6bVC",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Exlcoin",
    "symbol": "EXL",
    "decimals": 18
  },
  "shortName": "exl",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "exlscan",
      "url": "https://exlscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;