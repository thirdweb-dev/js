import type { Chain } from "../src/types";
export default {
  "chainId": 201804,
  "chain": "MYTH",
  "name": "Mythical Chain",
  "rpc": [
    "https://mythical-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.mythicalgames.com"
  ],
  "slug": "mythical-chain",
  "icon": {
    "url": "ipfs://bafkreihru6cccfblrjz5bv36znq2l3h67u6xj5ivtc4bj5l6gzofbgtnb4",
    "width": 350,
    "height": 350,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Mythos",
    "symbol": "MYTH",
    "decimals": 18
  },
  "infoURL": "https://mythicalgames.com/",
  "shortName": "myth",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Mythical Chain Explorer",
      "url": "https://explorer.mythicalgames.com",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;