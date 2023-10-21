import type { Chain } from "../src/types";
export default {
  "chain": "VSC",
  "chainId": 8889,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://vsc-dataseed.vyvo.org",
  "name": "Vyvo Smart Chain",
  "nativeCurrency": {
    "name": "VSC",
    "symbol": "VSC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://vyvo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vsc-dataseed.vyvo.org:8889"
  ],
  "shortName": "vsc",
  "slug": "vyvo-smart-chain",
  "testnet": false
} as const satisfies Chain;