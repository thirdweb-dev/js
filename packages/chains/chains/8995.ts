import type { Chain } from "../src/types";
export default {
  "chainId": 8995,
  "chain": "bloxberg",
  "name": "bloxberg",
  "rpc": [
    "https://bloxberg.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://core.bloxberg.org"
  ],
  "slug": "bloxberg",
  "faucets": [
    "https://faucet.bloxberg.org/"
  ],
  "nativeCurrency": {
    "name": "BERG",
    "symbol": "U+25B3",
    "decimals": 18
  },
  "infoURL": "https://bloxberg.org",
  "shortName": "berg",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;