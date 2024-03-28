import type { Chain } from "../src/types";
export default {
  "chain": "P2P",
  "chainId": 6502,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://peerpay.su.gy",
  "name": "Peerpay",
  "nativeCurrency": {
    "name": "Peerpay",
    "symbol": "P2P",
    "decimals": 18
  },
  "networkId": 6502,
  "rpc": [
    "https://6502.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://peerpay.su.gy/p2p"
  ],
  "shortName": "Peerpay",
  "slug": "peerpay",
  "testnet": false
} as const satisfies Chain;