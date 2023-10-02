import type { Chain } from "../src/types";
export default {
  "chain": "bloxberg",
  "chainId": 8995,
  "explorers": [],
  "faucets": [
    "https://faucet.bloxberg.org/"
  ],
  "features": [],
  "infoURL": "https://bloxberg.org",
  "name": "bloxberg",
  "nativeCurrency": {
    "name": "BERG",
    "symbol": "U+25B3",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bloxberg.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://core.bloxberg.org"
  ],
  "shortName": "berg",
  "slug": "bloxberg",
  "testnet": false
} as const satisfies Chain;