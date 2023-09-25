import type { Chain } from "../src/types";
export default {
  "chainId": 7777777,
  "chain": "ETH",
  "name": "Zora",
  "rpc": [
    "https://zora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zora.energy/"
  ],
  "slug": "zora",
  "icon": {
    "url": "ipfs://QmZ6qaRwTPFEZUspwMUjaxC6KhmzcELdRQcQzS3P72Dzts/Vector.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zora.energy",
  "shortName": "zora",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Zora Network Explorer",
      "url": "https://explorer.zora.energy",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;