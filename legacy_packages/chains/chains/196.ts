import type { Chain } from "../src/types";
export default {
  "chain": "X Layer",
  "chainId": 196,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/xlayer",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.okx.com/xlayer",
  "name": "X Layer Mainnet",
  "nativeCurrency": {
    "name": "X Layer Global Utility Token",
    "symbol": "OKB",
    "decimals": 18
  },
  "networkId": 196,
  "rpc": [
    "https://196.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.xlayer.tech",
    "https://xlayerrpc.okx.com"
  ],
  "shortName": "okb",
  "slug": "x-layer",
  "status": "active",
  "testnet": false
} as const satisfies Chain;