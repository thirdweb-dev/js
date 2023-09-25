import type { Chain } from "../src/types";
export default {
  "chainId": 3331,
  "chain": "Beach",
  "name": "ZCore Testnet",
  "rpc": [
    "https://zcore-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.zcore.cash"
  ],
  "slug": "zcore-testnet",
  "icon": {
    "url": "ipfs://QmQnXu13ym8W1VA3QxocaNVXGAuEPmamSCkS7bBscVk1f4",
    "width": 1050,
    "height": 1050,
    "format": "png"
  },
  "faucets": [
    "https://faucet.zcore.cash"
  ],
  "nativeCurrency": {
    "name": "ZCore",
    "symbol": "ZCR",
    "decimals": 18
  },
  "infoURL": "https://zcore.cash",
  "shortName": "zcrbeach",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;