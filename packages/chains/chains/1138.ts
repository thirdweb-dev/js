import type { Chain } from "../src/types";
export default {
  "chainId": 1138,
  "chain": "AmStar",
  "name": "AmStar Testnet",
  "rpc": [
    "https://amstar-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.amstarscan.com"
  ],
  "slug": "amstar-testnet",
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
  "shortName": "ASARt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "amstarscan-testnet",
      "url": "https://testnet.amstarscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;