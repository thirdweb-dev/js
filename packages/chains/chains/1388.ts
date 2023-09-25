import type { Chain } from "../src/types";
export default {
  "chainId": 1388,
  "chain": "AmStar",
  "name": "AmStar Mainnet",
  "rpc": [
    "https://amstar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.amstarscan.com"
  ],
  "slug": "amstar",
  "icon": {
    "url": "ipfs://Qmd4TMQdnYxaUZqnVddh5S37NGH72g2kkK38ccCEgdZz1C",
    "width": 599,
    "height": 563,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "SINSO",
    "symbol": "SINSO",
    "decimals": 18
  },
  "infoURL": "https://sinso.io",
  "shortName": "ASAR",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "amstarscan",
      "url": "https://mainnet.amstarscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;