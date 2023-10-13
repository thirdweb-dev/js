import type { Chain } from "../src/types";
export default {
  "chain": "Tomb Chain",
  "chainId": 6969,
  "explorers": [
    {
      "name": "tombscout",
      "url": "https://tombscout.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://tombchain.com/",
  "name": "Tomb Chain Mainnet",
  "nativeCurrency": {
    "name": "Tomb",
    "symbol": "TOMB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tomb-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tombchain.com/"
  ],
  "shortName": "tombchain",
  "slug": "tomb-chain",
  "testnet": false
} as const satisfies Chain;