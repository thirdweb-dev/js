import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 17186,
  "explorers": [],
  "faucets": [],
  "features": [],
  "name": "lazy-crimson-coral",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 17186,
  "parent": {
    "type": "L3",
    "chain": "Base",
    "bridges": [
      {
        "url": "https://lazy-crimson-coral-cotlv0ftqf.testnets.superbridge.app"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://17186.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-lazy-crimson-coral-cotlv0ftqf.t.conduit.xyz"
  ],
  "shortName": "lazy-crimson-coral",
  "slug": "lazy-crimson-coral",
  "testnet": true
} as const satisfies Chain;