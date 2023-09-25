import type { Chain } from "../src/types";
export default {
  "chainId": 6502,
  "chain": "P2P",
  "name": "Peerpay",
  "rpc": [
    "https://peerpay.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://peerpay.su.gy/p2p"
  ],
  "slug": "peerpay",
  "faucets": [],
  "nativeCurrency": {
    "name": "Peerpay",
    "symbol": "P2P",
    "decimals": 18
  },
  "infoURL": "https://peerpay.su.gy",
  "shortName": "Peerpay",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;