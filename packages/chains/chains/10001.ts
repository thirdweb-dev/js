import type { Chain } from "../src/types";
export default {
  "name": "Smart Bitcoin Cash Testnet",
  "chain": "smartBCHTest",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Cash Test Token",
    "symbol": "BCHT",
    "decimals": 18
  },
  "infoURL": "http://smartbch.org/",
  "shortName": "smartbchtest",
  "chainId": 10001,
  "networkId": 10001,
  "testnet": true,
  "slug": "smart-bitcoin-cash-testnet"
} as const satisfies Chain;