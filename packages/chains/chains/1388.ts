import type { Chain } from "../src/types";
export default {
  "chain": "AmStar",
  "chainId": 1388,
  "explorers": [
    {
      "name": "amstarscan",
      "url": "https://mainnet.amstarscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmd4TMQdnYxaUZqnVddh5S37NGH72g2kkK38ccCEgdZz1C",
    "width": 599,
    "height": 563,
    "format": "png"
  },
  "infoURL": "https://sinso.io",
  "name": "AmStar Mainnet",
  "nativeCurrency": {
    "name": "SINSO",
    "symbol": "SINSO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://amstar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.amstarscan.com"
  ],
  "shortName": "ASAR",
  "slug": "amstar",
  "testnet": false
} as const satisfies Chain;