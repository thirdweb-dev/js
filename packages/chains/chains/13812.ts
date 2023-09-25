import type { Chain } from "../src/types";
export default {
  "chainId": 13812,
  "chain": "SUS",
  "name": "Susono",
  "rpc": [
    "https://susono.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gateway.opn.network/node/ext/bc/2VsZe5DstWw2bfgdx3YbjKcMsJnNDjni95sZorBEdk9L9Qr9Fr/rpc"
  ],
  "slug": "susono",
  "faucets": [],
  "nativeCurrency": {
    "name": "Susono",
    "symbol": "OPN",
    "decimals": 18
  },
  "shortName": "sus",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Susono",
      "url": "http://explorer.opn.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;