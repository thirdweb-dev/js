import type { Chain } from "../src/types";
export default {
  "name": "The Root Network - Porcini Testnet",
  "chain": "TRN",
  "rpc": [
    "https://the-root-network-porcini-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://porcini.rootnet.app/archive",
    "wss://porcini.rootnet.app/archive/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 6
  },
  "infoURL": "https://www.futureverse.com/technology/root",
  "shortName": "trn-porcini",
  "chainId": 7672,
  "networkId": 7672,
  "explorers": [
    {
      "name": "rootnet",
      "url": "https://explorer.rootnet.cloud",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "the-root-network-porcini-testnet"
} as const satisfies Chain;