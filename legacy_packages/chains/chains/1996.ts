import type { Chain } from "../src/types";
export default {
  "chain": "Sanko",
  "chainId": 1996,
  "explorers": [
    {
      "name": "Sanko Explorer",
      "url": "https://explorer.sanko.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmbwi5FoJdL6HuFmQGQu1sdyoGrSuj45H12tMNTnpRAmLw",
    "width": 795,
    "height": 792,
    "format": "png"
  },
  "infoURL": "https://sanko.xyz/",
  "name": "Sanko",
  "nativeCurrency": {
    "name": "DMT",
    "symbol": "DMT",
    "decimals": 18
  },
  "networkId": 1996,
  "rpc": [
    "https://1996.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.sanko.xyz"
  ],
  "shortName": "Sanko",
  "slug": "sanko",
  "testnet": false
} as const satisfies Chain;