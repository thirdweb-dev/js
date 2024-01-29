import type { Chain } from "../src/types";
export default {
  "chain": "Ancient8",
  "chainId": 888888888,
  "explorers": [
    {
      "name": "Ancient8 Explorer",
      "url": "https://scan.ancient8.gg",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreievnqg3xjokaty4kfbxxbrzm5v5y7exbaaia2txrh4sfgrqsalfym",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://ancient8.gg/",
  "name": "Ancient8",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 888888888,
  "rpc": [
    "https://ancient8.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://888888888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ancient8.gg"
  ],
  "shortName": "ancient8",
  "slug": "ancient8",
  "testnet": false
} as const satisfies Chain;