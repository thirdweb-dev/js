import type { Chain } from "../src/types";
export default {
  "chain": "Combo",
  "chainId": 91715,
  "explorers": [
    {
      "name": "combotrace explorer",
      "url": "https://combotrace-testnet.nodereal.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://combonetwork.io",
  "name": "Combo Testnet",
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "tcBNB",
    "decimals": 18
  },
  "networkId": 91715,
  "rpc": [
    "https://91715.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-rpc.combonetwork.io"
  ],
  "shortName": "combo-testnet",
  "slug": "combo-testnet",
  "testnet": true
} as const satisfies Chain;