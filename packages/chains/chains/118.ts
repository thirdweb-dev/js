import type { Chain } from "../src/types";
export default {
  "chainId": 118,
  "chain": "Arcology",
  "name": "Arcology Testnet",
  "rpc": [
    "https://arcology-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.arcology.network/rpc"
  ],
  "slug": "arcology-testnet",
  "icon": {
    "url": "ipfs://QmRD7itMvaZutfBjyA7V9xkMGDtsZiJSagPwd3ijqka8kE",
    "width": 288,
    "height": 288,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Arcology Coin",
    "symbol": "Acol",
    "decimals": 18
  },
  "infoURL": "https://arcology.network/",
  "shortName": "arcology",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "arcology",
      "url": "https://testnet.arcology.network/explorer",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;