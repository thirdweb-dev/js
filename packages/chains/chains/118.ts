import type { Chain } from "../src/types";
export default {
  "chain": "Arcology",
  "chainId": 118,
  "explorers": [
    {
      "name": "arcology",
      "url": "https://testnet.arcology.network/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRD7itMvaZutfBjyA7V9xkMGDtsZiJSagPwd3ijqka8kE",
    "width": 288,
    "height": 288,
    "format": "png"
  },
  "infoURL": "https://arcology.network/",
  "name": "Arcology Testnet",
  "nativeCurrency": {
    "name": "Arcology Coin",
    "symbol": "Acol",
    "decimals": 18
  },
  "networkId": 118,
  "rpc": [
    "https://118.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.arcology.network/rpc"
  ],
  "shortName": "arcology",
  "slip44": 1,
  "slug": "arcology-testnet",
  "testnet": true
} as const satisfies Chain;