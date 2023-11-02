import type { Chain } from "../src/types";
export default {
  "chain": "ELLA",
  "chainId": 64,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://ellaism.org",
  "name": "Ellaism",
  "nativeCurrency": {
    "name": "Ellaism Ether",
    "symbol": "ELLA",
    "decimals": 18
  },
  "networkId": 64,
  "rpc": [
    "https://ellaism.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://64.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.ellaism.org"
  ],
  "shortName": "ellaism",
  "slip44": 163,
  "slug": "ellaism",
  "testnet": false
} as const satisfies Chain;