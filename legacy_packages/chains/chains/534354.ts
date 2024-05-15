import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 534354,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://scroll.io",
  "name": "Scroll Pre-Alpha Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "TSETH",
    "decimals": 18
  },
  "networkId": 534354,
  "rpc": [],
  "shortName": "scr-prealpha",
  "slip44": 1,
  "slug": "scroll-pre-alpha-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;