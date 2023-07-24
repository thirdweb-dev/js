import type { Chain } from "../src/types";
export default {
  "name": "Codefin Mainnet",
  "chain": "COF",
  "icon": {
    "url": "ipfs://QmVyAuAnKKNnGEpqeYMLPRfMdysLgPBTZeEXihXbRytGhp",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://codefin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.codefin.pro"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Codefin",
    "symbol": "COF",
    "decimals": 18
  },
  "infoURL": "https://network.codefin.pro",
  "shortName": "COF",
  "chainId": 9223,
  "networkId": 9223,
  "explorers": [
    {
      "name": "Codefin Net Explorer",
      "url": "https://explorer.codefin.pro",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "codefin"
} as const satisfies Chain;