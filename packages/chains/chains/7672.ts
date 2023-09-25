import type { Chain } from "../src/types";
export default {
  "chainId": 7672,
  "chain": "TRN",
  "name": "The Root Network - Porcini Testnet",
  "rpc": [
    "https://the-root-network-porcini-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://porcini.rootnet.app/archive",
    "wss://porcini.rootnet.app/archive/ws"
  ],
  "slug": "the-root-network-porcini-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 6
  },
  "infoURL": "https://www.futureverse.com/technology/root",
  "shortName": "trn-porcini",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "rootnet",
      "url": "https://explorer.rootnet.cloud",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;