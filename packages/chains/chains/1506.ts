import type { Chain } from "../src/types";
export default {
  "chain": "Sherpax Mainnet",
  "chainId": 1506,
  "explorers": [
    {
      "name": "Sherpax Mainnet Explorer",
      "url": "https://evm.sherpax.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://sherpax.io/",
  "name": "Sherpax Mainnet",
  "nativeCurrency": {
    "name": "KSX",
    "symbol": "KSX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://sherpax.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.sherpax.io/rpc"
  ],
  "shortName": "Sherpax",
  "slug": "sherpax",
  "testnet": false
} as const satisfies Chain;