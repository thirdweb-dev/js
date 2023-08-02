import type { Chain } from "../src/types";
export default {
  "name": "Kalar Chain",
  "chain": "KLC",
  "icon": {
    "url": "ipfs://bafkreihfoy2kgf2rebaoicso7z5h7ju46z6gtr64mskkths3qbfkrtnkjm",
    "width": 190,
    "height": 170,
    "format": "png"
  },
  "rpc": [
    "https://kalar-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-api.kalarchain.tech"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kalar",
    "symbol": "KLC",
    "decimals": 18
  },
  "infoURL": "https://kalarchain.tech",
  "shortName": "KLC",
  "chainId": 1379,
  "networkId": 1379,
  "explorers": [
    {
      "name": "kalarscan",
      "url": "https://explorer.kalarchain.tech",
      "icon": {
        "url": "ipfs://bafkreidbzzv3lrwlzquhlpl4jcmr54sifhi5ufoek6olb5kjh3h3kvktdq",
        "width": 411,
        "height": 159,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "kalar-chain"
} as const satisfies Chain;