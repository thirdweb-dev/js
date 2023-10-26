import type { Chain } from "../src/types";
export default {
  "chain": "COF",
  "chainId": 9223,
  "explorers": [
    {
      "name": "Codefin Net Explorer",
      "url": "https://explorer.codefin.pro",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVyAuAnKKNnGEpqeYMLPRfMdysLgPBTZeEXihXbRytGhp",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://network.codefin.pro",
  "name": "Codefin Mainnet",
  "nativeCurrency": {
    "name": "Codefin",
    "symbol": "COF",
    "decimals": 18
  },
  "networkId": 9223,
  "rpc": [
    "https://codefin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9223.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.codefin.pro"
  ],
  "shortName": "COF",
  "slug": "codefin",
  "testnet": false
} as const satisfies Chain;