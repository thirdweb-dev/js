import type { Chain } from "../types";
export default {
  "chain": "TEXL",
  "chainId": 27082017,
  "explorers": [
    {
      "name": "exlscan",
      "url": "https://testnet-explorer.exlscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmeooM7QicT1YbgY93XPd5p7JsCjYhN3qjWt68X57g6bVC",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.exlscan.com"
  ],
  "icon": {
    "url": "ipfs://QmeooM7QicT1YbgY93XPd5p7JsCjYhN3qjWt68X57g6bVC",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "name": "Excoincial Chain Volta-Testnet",
  "nativeCurrency": {
    "name": "TExlcoin",
    "symbol": "TEXL",
    "decimals": 18
  },
  "networkId": 27082017,
  "rpc": [
    "https://excoincial-chain-volta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://27082017.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.exlscan.com"
  ],
  "shortName": "exlvolta",
  "slug": "excoincial-chain-volta-testnet",
  "testnet": true
} as const satisfies Chain;