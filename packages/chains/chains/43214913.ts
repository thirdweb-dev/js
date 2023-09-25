import type { Chain } from "../src/types";
export default {
  "chainId": 43214913,
  "chain": "MAI",
  "name": "maistestsubnet",
  "rpc": [
    "https://maistestsubnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://174.138.9.169:9650/ext/bc/VUKSzFZKckx4PoZF9gX5QAqLPxbLzvu1vcssPG5QuodaJtdHT/rpc"
  ],
  "slug": "maistestsubnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "maistestsubnet",
    "symbol": "MAI",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "mais",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "maistesntet",
      "url": "http://174.138.9.169:3006/?network=maistesntet",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;