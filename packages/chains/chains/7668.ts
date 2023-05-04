import type { Chain } from "../src/types";
export default {
  "name": "The Root Network - Mainnet",
  "chain": "TRN",
  "rpc": [
    "https://the-root-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://root.rootnet.live/archive",
    "wss://root.rootnet.live/archive/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 6
  },
  "infoURL": "https://www.futureverse.com/technology/root",
  "shortName": "trn-mainnet",
  "chainId": 7668,
  "networkId": 7668,
  "explorers": [
    {
      "name": "rootnet",
      "url": "https://explorer.rootnet.live",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "the-root-network"
} as const satisfies Chain;