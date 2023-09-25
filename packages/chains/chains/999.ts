import type { Chain } from "../src/types";
export default {
  "chainId": 999,
  "chain": "ETH",
  "name": "Zora Testnet",
  "rpc": [
    "https://zora-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.zora.co/"
  ],
  "slug": "zora-testnet",
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
  "infoURL": null,
  "shortName": "Zora",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;