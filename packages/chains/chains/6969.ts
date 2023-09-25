import type { Chain } from "../src/types";
export default {
  "chainId": 6969,
  "chain": "Tomb Chain",
  "name": "Tomb Chain Mainnet",
  "rpc": [
    "https://tomb-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tombchain.com/"
  ],
  "slug": "tomb-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Tomb",
    "symbol": "TOMB",
    "decimals": 18
  },
  "infoURL": "https://tombchain.com/",
  "shortName": "tombchain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "tombscout",
      "url": "https://tombscout.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;