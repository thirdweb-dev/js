import type { Chain } from "../src/types";
export default {
  "chain": "XPR",
  "chainId": 110,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://protonchain.com",
  "name": "Proton Testnet",
  "nativeCurrency": {
    "name": "Proton",
    "symbol": "XPR",
    "decimals": 4
  },
  "networkId": 110,
  "rpc": [
    "https://proton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://110.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://protontestnet.greymass.com/"
  ],
  "shortName": "xpr",
  "slug": "proton-testnet",
  "testnet": true
} as const satisfies Chain;