import type { Chain } from "../src/types";
export default {
  "chainId": 25888,
  "chain": "HammerChain",
  "name": "Hammer Chain Mainnet",
  "rpc": [
    "https://hammer-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.hammerchain.io/rpc"
  ],
  "slug": "hammer-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "GOLDT",
    "symbol": "GOLDT",
    "decimals": 18
  },
  "infoURL": "https://www.hammerchain.io",
  "shortName": "GOLDT",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Hammer Chain Explorer",
      "url": "https://www.hammerchain.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;