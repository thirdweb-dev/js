import type { Chain } from "../src/types";
export default {
  "chain": "HammerChain",
  "chainId": 25888,
  "explorers": [
    {
      "name": "Hammer Chain Explorer",
      "url": "https://www.hammerchain.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.hammerchain.io",
  "name": "Hammer Chain Mainnet",
  "nativeCurrency": {
    "name": "GOLDT",
    "symbol": "GOLDT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://hammer-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.hammerchain.io/rpc"
  ],
  "shortName": "GOLDT",
  "slug": "hammer-chain",
  "testnet": false
} as const satisfies Chain;