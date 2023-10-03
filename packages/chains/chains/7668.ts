import type { Chain } from "../src/types";
export default {
  "chain": "TRN",
  "chainId": 7668,
  "explorers": [
    {
      "name": "rootnet",
      "url": "https://explorer.rootnet.live",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.futureverse.com/technology/root",
  "name": "The Root Network - Mainnet",
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://the-root-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://root.rootnet.live/archive",
    "wss://root.rootnet.live/archive/ws"
  ],
  "shortName": "trn-mainnet",
  "slug": "the-root-network",
  "testnet": false
} as const satisfies Chain;