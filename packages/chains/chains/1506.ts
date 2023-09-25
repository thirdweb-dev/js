import type { Chain } from "../src/types";
export default {
  "chainId": 1506,
  "chain": "Sherpax Mainnet",
  "name": "Sherpax Mainnet",
  "rpc": [
    "https://sherpax.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.sherpax.io/rpc"
  ],
  "slug": "sherpax",
  "faucets": [],
  "nativeCurrency": {
    "name": "KSX",
    "symbol": "KSX",
    "decimals": 18
  },
  "infoURL": "https://sherpax.io/",
  "shortName": "Sherpax",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Sherpax Mainnet Explorer",
      "url": "https://evm.sherpax.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;