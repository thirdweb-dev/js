import type { Chain } from "../src/types";
export default {
  "chainId": 1507,
  "chain": "Sherpax Testnet",
  "name": "Sherpax Testnet",
  "rpc": [
    "https://sherpax-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sherpax-testnet.chainx.org/rpc"
  ],
  "slug": "sherpax-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "KSX",
    "symbol": "KSX",
    "decimals": 18
  },
  "infoURL": "https://sherpax.io/",
  "shortName": "SherpaxTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Sherpax Testnet Explorer",
      "url": "https://evm-pre.sherpax.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;