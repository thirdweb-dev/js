import type { Chain } from "../src/types";
export default {
  "name": "Centrifuge",
  "chain": "CFG",
  "rpc": [
    "wss://fullnode.parachain.centrifuge.io"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Centrifuge",
    "symbol": "CFG",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "shortName": "cfg",
  "chainId": 2031,
  "networkId": 2031,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://centrifuge.subscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "centrifuge"
} as const satisfies Chain;