import type { Chain } from "../src/types";
export default {
  "name": "Zora",
  "chain": "ETH",
  "rpc": [
    "https://zora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zora.co/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zora.co",
  "shortName": "zora",
  "chainId": 7777777,
  "networkId": 7777777,
  "explorers": [
    {
      "name": "Zora Network Explorer",
      "url": "https://explorer.zora.co",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "zora"
} as const satisfies Chain;