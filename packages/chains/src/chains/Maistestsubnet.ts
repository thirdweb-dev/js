import type { Chain } from "../types";
export default {
  "chain": "MAI",
  "chainId": 43214913,
  "explorers": [
    {
      "name": "maistesntet",
      "url": "http://174.138.9.169:3006/?network=maistesntet",
      "standard": "none"
    }
  ],
  "faucets": [],
  "name": "maistestsubnet",
  "nativeCurrency": {
    "name": "maistestsubnet",
    "symbol": "MAI",
    "decimals": 18
  },
  "networkId": 43214913,
  "rpc": [
    "https://maistestsubnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://43214913.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://174.138.9.169:9650/ext/bc/VUKSzFZKckx4PoZF9gX5QAqLPxbLzvu1vcssPG5QuodaJtdHT/rpc"
  ],
  "shortName": "mais",
  "slug": "maistestsubnet",
  "testnet": true
} as const satisfies Chain;