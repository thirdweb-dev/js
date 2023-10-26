import type { Chain } from "../src/types";
export default {
  "chain": "bloxberg",
  "chainId": 8995,
  "explorers": [],
  "faucets": [
    "https://faucet.bloxberg.org/"
  ],
  "infoURL": "https://bloxberg.org",
  "name": "bloxberg",
  "nativeCurrency": {
    "name": "BERG",
    "symbol": "U+25B3",
    "decimals": 18
  },
  "networkId": 8995,
  "rpc": [
    "https://bloxberg.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8995.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://core.bloxberg.org"
  ],
  "shortName": "berg",
  "slug": "bloxberg",
  "testnet": false
} as const satisfies Chain;