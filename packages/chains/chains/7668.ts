import type { Chain } from "../src/types";
export default {
  "chainId": 7668,
  "chain": "TRN",
  "name": "The Root Network - Mainnet",
  "rpc": [
    "https://the-root-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://root.rootnet.live/archive",
    "wss://root.rootnet.live/archive/ws"
  ],
  "slug": "the-root-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 6
  },
  "infoURL": "https://www.futureverse.com/technology/root",
  "shortName": "trn-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "rootnet",
      "url": "https://explorer.rootnet.live",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;