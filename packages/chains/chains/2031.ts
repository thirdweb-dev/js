import type { Chain } from "../src/types";
export default {
  "chain": "CFG",
  "chainId": 2031,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://centrifuge.subscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://centrifuge.io",
  "name": "Centrifuge",
  "nativeCurrency": {
    "name": "Centrifuge",
    "symbol": "CFG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://centrifuge.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fullnode.parachain.centrifuge.io"
  ],
  "shortName": "cfg",
  "slug": "centrifuge",
  "testnet": false
} as const satisfies Chain;