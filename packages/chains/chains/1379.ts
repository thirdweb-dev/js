import type { Chain } from "../src/types";
export default {
  "chainId": 1379,
  "chain": "KLC",
  "name": "Kalar Chain",
  "rpc": [
    "https://kalar-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-api.kalarchain.tech"
  ],
  "slug": "kalar-chain",
  "icon": {
    "url": "ipfs://bafkreihfoy2kgf2rebaoicso7z5h7ju46z6gtr64mskkths3qbfkrtnkjm",
    "width": 190,
    "height": 170,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Kalar",
    "symbol": "KLC",
    "decimals": 18
  },
  "infoURL": "https://kalarchain.tech",
  "shortName": "KLC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "kalarscan",
      "url": "https://explorer.kalarchain.tech",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;