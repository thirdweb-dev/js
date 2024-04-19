import type { Chain } from "../src/types";
export default {
  "chain": "Planq",
  "chainId": 7077,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWEy9xK5BoqxPuVs7T48WM4exJrxzkEFt45iHcxWqUy8D",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://planq.network",
  "name": "Planq Atlas Testnet",
  "nativeCurrency": {
    "name": "Planq",
    "symbol": "tPLQ",
    "decimals": 18
  },
  "networkId": 7077,
  "rpc": [
    "https://7077.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc-atlas.planq.network"
  ],
  "shortName": "planq-atlas-testnet",
  "slug": "planq-atlas-testnet",
  "testnet": true
} as const satisfies Chain;