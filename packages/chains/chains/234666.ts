import type { Chain } from "../src/types";
export default {
  "chain": "tHYM",
  "chainId": 234666,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://haymoswap.web.app/",
  "name": "Haymo Testnet",
  "nativeCurrency": {
    "name": "HAYMO",
    "symbol": "HYM",
    "decimals": 18
  },
  "networkId": 234666,
  "rpc": [
    "https://haymo-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://234666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet1.haymo.network"
  ],
  "shortName": "hym",
  "slug": "haymo-testnet",
  "testnet": true
} as const satisfies Chain;