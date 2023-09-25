import type { Chain } from "../src/types";
export default {
  "chainId": 8889,
  "chain": "VSC",
  "name": "Vyvo Smart Chain",
  "rpc": [
    "https://vyvo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vsc-dataseed.vyvo.org:8889"
  ],
  "slug": "vyvo-smart-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "VSC",
    "symbol": "VSC",
    "decimals": 18
  },
  "infoURL": "https://vsc-dataseed.vyvo.org",
  "shortName": "vsc",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;