import type { Chain } from "../types";
export default {
  "chain": "SUS",
  "chainId": 13812,
  "explorers": [
    {
      "name": "Susono",
      "url": "http://explorer.opn.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "name": "Susono",
  "nativeCurrency": {
    "name": "Susono",
    "symbol": "OPN",
    "decimals": 18
  },
  "networkId": 13812,
  "rpc": [
    "https://susono.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://13812.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gateway.opn.network/node/ext/bc/2VsZe5DstWw2bfgdx3YbjKcMsJnNDjni95sZorBEdk9L9Qr9Fr/rpc"
  ],
  "shortName": "sus",
  "slug": "susono",
  "testnet": false
} as const satisfies Chain;