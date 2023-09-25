import type { Chain } from "../src/types";
export default {
  "chainId": 1688,
  "chain": "LUDAN",
  "name": "LUDAN Mainnet",
  "rpc": [
    "https://ludan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ludan.org/"
  ],
  "slug": "ludan",
  "icon": {
    "url": "ipfs://bafkreigzeanzqgxrzzep45t776ovbwi242poqxbryuu2go5eedeuwwcsay",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "LUDAN",
    "symbol": "LUDAN",
    "decimals": 18
  },
  "infoURL": "https://www.ludan.org/",
  "shortName": "LUDAN",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;