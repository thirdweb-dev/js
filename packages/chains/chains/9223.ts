import type { Chain } from "../src/types";
export default {
  "chainId": 9223,
  "chain": "COF",
  "name": "Codefin Mainnet",
  "rpc": [
    "https://codefin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.codefin.pro"
  ],
  "slug": "codefin",
  "icon": {
    "url": "ipfs://QmVyAuAnKKNnGEpqeYMLPRfMdysLgPBTZeEXihXbRytGhp",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Codefin",
    "symbol": "COF",
    "decimals": 18
  },
  "infoURL": "https://network.codefin.pro",
  "shortName": "COF",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Codefin Net Explorer",
      "url": "https://explorer.codefin.pro",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;