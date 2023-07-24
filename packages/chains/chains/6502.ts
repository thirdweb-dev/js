import type { Chain } from "../src/types";
export default {
  "name": "Peerpay",
  "chain": "P2P",
  "rpc": [
    "https://peerpay.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://peerpay.su.gy/p2p"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Peerpay",
    "symbol": "P2P",
    "decimals": 18
  },
  "infoURL": "https://peerpay.su.gy",
  "shortName": "Peerpay",
  "chainId": 6502,
  "networkId": 6502,
  "explorers": [],
  "testnet": false,
  "slug": "peerpay"
} as const satisfies Chain;