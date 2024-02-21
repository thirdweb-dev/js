import type { Chain } from "../src/types";
export default {
  "chain": "TCG Verse",
  "chainId": 2400,
  "explorers": [
    {
      "name": "TCG Verse Explorer",
      "url": "https://explorer.tcgverse.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreidg4wpewve5mdxrofneqblydkrjl3oevtgpdf3fk3z3vjqam6ocoe",
    "width": 350,
    "height": 350,
    "format": "png"
  },
  "infoURL": "https://tcgverse.xyz/",
  "name": "TCG Verse Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 2400,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://2400.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tcgverse.xyz"
  ],
  "shortName": "TCGV",
  "slug": "tcg-verse",
  "testnet": false
} as const satisfies Chain;