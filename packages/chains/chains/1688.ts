import type { Chain } from "../src/types";
export default {
  "chain": "LUDAN",
  "chainId": 1688,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreigzeanzqgxrzzep45t776ovbwi242poqxbryuu2go5eedeuwwcsay",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.ludan.org/",
  "name": "LUDAN Mainnet",
  "nativeCurrency": {
    "name": "LUDAN",
    "symbol": "LUDAN",
    "decimals": 18
  },
  "networkId": 1688,
  "rpc": [
    "https://ludan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1688.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ludan.org/"
  ],
  "shortName": "LUDAN",
  "slug": "ludan",
  "testnet": false
} as const satisfies Chain;