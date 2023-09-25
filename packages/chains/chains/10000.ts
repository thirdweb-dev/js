import type { Chain } from "../src/types";
export default {
  "chainId": 10000,
  "chain": "smartBCH",
  "name": "Smart Bitcoin Cash",
  "rpc": [
    "https://smart-bitcoin-cash.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://smartbch.greyh.at",
    "https://rpc-mainnet.smartbch.org",
    "https://smartbch.fountainhead.cash/mainnet",
    "https://smartbch.devops.cash/mainnet"
  ],
  "slug": "smart-bitcoin-cash",
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Cash",
    "symbol": "BCH",
    "decimals": 18
  },
  "infoURL": "https://smartbch.org/",
  "shortName": "smartbch",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;