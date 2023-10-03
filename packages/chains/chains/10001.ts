import type { Chain } from "../src/types";
export default {
  "chain": "smartBCHTest",
  "chainId": 10001,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "http://smartbch.org/",
  "name": "Smart Bitcoin Cash Testnet",
  "nativeCurrency": {
    "name": "Bitcoin Cash Test Token",
    "symbol": "BCHT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://smart-bitcoin-cash-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.smartbch.org",
    "https://smartbch.devops.cash/testnet"
  ],
  "shortName": "smartbchtest",
  "slug": "smart-bitcoin-cash-testnet",
  "testnet": true
} as const satisfies Chain;