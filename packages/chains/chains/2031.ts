import type { Chain } from "../src/types";
export default {
  "chainId": 2031,
  "chain": "CFG",
  "name": "Centrifuge",
  "rpc": [
    "https://centrifuge.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fullnode.parachain.centrifuge.io"
  ],
  "slug": "centrifuge",
  "faucets": [],
  "nativeCurrency": {
    "name": "Centrifuge",
    "symbol": "CFG",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "shortName": "cfg",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "subscan",
      "url": "https://centrifuge.subscan.io",
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