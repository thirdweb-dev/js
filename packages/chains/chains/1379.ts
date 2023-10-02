import type { Chain } from "../src/types";
export default {
  "chain": "KLC",
  "chainId": 1379,
  "explorers": [
    {
      "name": "kalarscan",
      "url": "https://explorer.kalarchain.tech",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreihfoy2kgf2rebaoicso7z5h7ju46z6gtr64mskkths3qbfkrtnkjm",
    "width": 190,
    "height": 170,
    "format": "png"
  },
  "infoURL": "https://kalarchain.tech",
  "name": "Kalar Chain",
  "nativeCurrency": {
    "name": "Kalar",
    "symbol": "KLC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kalar-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-api.kalarchain.tech"
  ],
  "shortName": "KLC",
  "slug": "kalar-chain",
  "testnet": false
} as const satisfies Chain;