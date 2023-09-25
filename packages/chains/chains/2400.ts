import type { Chain } from "../src/types";
export default {
  "chainId": 2400,
  "chain": "TCG Verse",
  "name": "TCG Verse Mainnet",
  "rpc": [
    "https://tcg-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tcgverse.xyz"
  ],
  "slug": "tcg-verse",
  "icon": {
    "url": "ipfs://bafkreidg4wpewve5mdxrofneqblydkrjl3oevtgpdf3fk3z3vjqam6ocoe",
    "width": 350,
    "height": 350,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://tcgverse.xyz/",
  "shortName": "TCGV",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "TCG Verse Explorer",
      "url": "https://explorer.tcgverse.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;