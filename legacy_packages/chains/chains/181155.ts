import type { Chain } from "../src/types";
export default {
  "chain": "TCC Network",
  "chainId": 181155,
  "explorers": [
    {
      "name": "Tcc Scan",
      "url": "https://scan.tccworld.org/",
      "standard": "181155",
      "icon": {
        "url": "ipfs://QmchZTtvuU7oRe3rSu1HNPELJQdnutV79NjcHxoybJ4SVo/tcc-coin.png",
        "width": 100,
        "height": 100,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmchZTtvuU7oRe3rSu1HNPELJQdnutV79NjcHxoybJ4SVo/tcc-coin.png",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "name": "TCC Network",
  "nativeCurrency": {
    "name": "The ChampCoin",
    "symbol": "TCC",
    "decimals": 18
  },
  "networkId": 181155,
  "redFlags": [],
  "rpc": [],
  "shortName": "TCC",
  "slug": "tcc-network",
  "testnet": false
} as const satisfies Chain;