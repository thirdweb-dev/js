import type { Chain } from "../src/types";
export default {
  "chain": "Sherpax Testnet",
  "chainId": 1507,
  "explorers": [
    {
      "name": "Sherpax Testnet Explorer",
      "url": "https://evm-pre.sherpax.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://sherpax.io/",
  "name": "Sherpax Testnet",
  "nativeCurrency": {
    "name": "KSX",
    "symbol": "KSX",
    "decimals": 18
  },
  "networkId": 1507,
  "rpc": [
    "https://sherpax-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1507.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sherpax-testnet.chainx.org/rpc"
  ],
  "shortName": "SherpaxTestnet",
  "slug": "sherpax-testnet",
  "testnet": true
} as const satisfies Chain;