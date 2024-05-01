import type { Chain } from "../src/types";
export default {
  "chain": "Yooldo Verse",
  "chainId": 50005,
  "explorers": [
    {
      "name": "Yooldo Verse Explorer",
      "url": "https://explorer.yooldo-verse.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://yooldo.gg/",
  "name": "Yooldo Verse Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 50005,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://50005.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.yooldo-verse.xyz/"
  ],
  "shortName": "YVM",
  "slug": "yooldo-verse",
  "testnet": false
} as const satisfies Chain;