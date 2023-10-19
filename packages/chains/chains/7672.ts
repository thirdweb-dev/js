import type { Chain } from "../src/types";
export default {
  "chain": "TRN",
  "chainId": 7672,
  "explorers": [
    {
      "name": "rootnet",
      "url": "https://explorer.rootnet.cloud",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.futureverse.com/technology/root",
  "name": "The Root Network - Porcini Testnet",
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://the-root-network-porcini-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://porcini.rootnet.app/archive",
    "wss://porcini.rootnet.app/archive/ws"
  ],
  "shortName": "trn-porcini",
  "slug": "the-root-network-porcini-testnet",
  "testnet": true
} as const satisfies Chain;