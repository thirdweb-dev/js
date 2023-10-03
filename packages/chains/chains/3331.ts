import type { Chain } from "../src/types";
export default {
  "chain": "Beach",
  "chainId": 3331,
  "explorers": [],
  "faucets": [
    "https://faucet.zcore.cash"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmQnXu13ym8W1VA3QxocaNVXGAuEPmamSCkS7bBscVk1f4",
    "width": 1050,
    "height": 1050,
    "format": "png"
  },
  "infoURL": "https://zcore.cash",
  "name": "ZCore Testnet",
  "nativeCurrency": {
    "name": "ZCore",
    "symbol": "ZCR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://zcore-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.zcore.cash"
  ],
  "shortName": "zcrbeach",
  "slug": "zcore-testnet",
  "testnet": true
} as const satisfies Chain;