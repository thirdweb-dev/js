import type { Chain } from "../types";
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
  "infoURL": "https://www.futureverse.com/technology/root",
  "name": "The Root Network - Mainnet",
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 6
  },
  "networkId": 7668,
  "rpc": [
    "https://the-root-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7668.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://root.rootnet.live/archive",
    "wss://root.rootnet.live/archive/ws"
  ],
  "shortName": "trn-mainnet",
  "slug": "the-root-network",
  "testnet": false
} as const satisfies Chain;