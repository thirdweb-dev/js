import type { Chain } from "../src/types";
export default {
  "chainId": 110,
  "chain": "XPR",
  "name": "Proton Testnet",
  "rpc": [
    "https://proton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://protontestnet.greymass.com/"
  ],
  "slug": "proton-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Proton",
    "symbol": "XPR",
    "decimals": 4
  },
  "infoURL": "https://protonchain.com",
  "shortName": "xpr",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;