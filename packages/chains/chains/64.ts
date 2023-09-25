import type { Chain } from "../src/types";
export default {
  "chainId": 64,
  "chain": "ELLA",
  "name": "Ellaism",
  "rpc": [
    "https://ellaism.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.ellaism.org"
  ],
  "slug": "ellaism",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ellaism Ether",
    "symbol": "ELLA",
    "decimals": 18
  },
  "infoURL": "https://ellaism.org",
  "shortName": "ellaism",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;