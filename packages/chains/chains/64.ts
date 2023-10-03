import type { Chain } from "../src/types";
export default {
  "chain": "ELLA",
  "chainId": 64,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://ellaism.org",
  "name": "Ellaism",
  "nativeCurrency": {
    "name": "Ellaism Ether",
    "symbol": "ELLA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ellaism.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.ellaism.org"
  ],
  "shortName": "ellaism",
  "slug": "ellaism",
  "testnet": false
} as const satisfies Chain;