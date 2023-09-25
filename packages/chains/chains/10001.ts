import type { Chain } from "../src/types";
export default {
  "chainId": 10001,
  "chain": "smartBCHTest",
  "name": "Smart Bitcoin Cash Testnet",
  "rpc": [
    "https://smart-bitcoin-cash-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.smartbch.org",
    "https://smartbch.devops.cash/testnet"
  ],
  "slug": "smart-bitcoin-cash-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Cash Test Token",
    "symbol": "BCHT",
    "decimals": 18
  },
  "infoURL": "http://smartbch.org/",
  "shortName": "smartbchtest",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;