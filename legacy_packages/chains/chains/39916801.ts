import type { Chain } from "../src/types";
export default {
  "chain": "KingdomChain",
  "chainId": 39916801,
  "explorers": [
    {
      "name": "TravelSong",
      "url": "https://www.beastkingdom.io/travelsong",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://www.beastkingdom.io/",
  "name": "Kingdom Chain",
  "nativeCurrency": {
    "name": "Kozi",
    "symbol": "KOZI",
    "decimals": 18
  },
  "networkId": 39916801,
  "rpc": [
    "https://39916801.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kingdomchain.observer/rpc"
  ],
  "shortName": "kchain",
  "slug": "kingdom-chain",
  "testnet": false
} as const satisfies Chain;