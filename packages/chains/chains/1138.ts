import type { Chain } from "../src/types";
export default {
  "chain": "AmStar",
  "chainId": 1138,
  "explorers": [
    {
      "name": "amstarscan-testnet",
      "url": "https://testnet.amstarscan.com",
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
  "name": "AmStar Testnet",
  "nativeCurrency": {
    "name": "SINSO",
    "symbol": "SINSO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://amstar-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.amstarscan.com"
  ],
  "shortName": "ASARt",
  "slug": "amstar-testnet",
  "testnet": true
} as const satisfies Chain;