import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 167008,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.katla.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://taiko.xyz",
  "name": "Taiko Katla L2",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 167008,
  "redFlags": [],
  "rpc": [
    "https://167008.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.katla.taiko.xyz",
    "wss://ws.katla.taiko.xyz",
    "https://taiko-katla.drpc.org",
    "wss://taiko-katla.drpc.org"
  ],
  "shortName": "tko-katla",
  "slug": "taiko-katla-l2",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;