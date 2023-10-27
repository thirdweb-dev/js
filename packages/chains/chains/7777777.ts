import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 7777777,
  "explorers": [
    {
      "name": "Zora Network Explorer",
      "url": "https://explorer.zora.energy",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZ6qaRwTPFEZUspwMUjaxC6KhmzcELdRQcQzS3P72Dzts/Vector.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://zora.energy",
  "name": "Zora",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 7777777,
  "redFlags": [],
  "rpc": [
    "https://zora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7777777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zora.energy/"
  ],
  "shortName": "zora",
  "slug": "zora",
  "testnet": false
} as const satisfies Chain;