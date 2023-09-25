import type { Chain } from "../src/types";
export default {
  "chainId": 27082017,
  "chain": "TEXL",
  "name": "Excoincial Chain Volta-Testnet",
  "rpc": [
    "https://excoincial-chain-volta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.exlscan.com"
  ],
  "slug": "excoincial-chain-volta-testnet",
  "icon": {
    "url": "ipfs://QmeooM7QicT1YbgY93XPd5p7JsCjYhN3qjWt68X57g6bVC",
    "width": 400,
    "height": 400,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "exlscan",
      "url": "https://testnet-explorer.exlscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;