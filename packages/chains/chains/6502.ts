import type { Chain } from "../src/types";
export default {
  "chain": "P2P",
  "chainId": 6502,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://peerpay.su.gy",
  "name": "Peerpay",
  "nativeCurrency": {
    "name": "Peerpay",
    "symbol": "P2P",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://peerpay.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://peerpay.su.gy/p2p"
  ],
  "shortName": "Peerpay",
  "slug": "peerpay",
  "testnet": false
} as const satisfies Chain;