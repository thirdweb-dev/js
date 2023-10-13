import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 421611,
  "explorers": [
    {
      "name": "arbiscan-testnet",
      "url": "https://testnet.arbiscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "arbitrum-rinkeby",
      "url": "https://rinkeby-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=421611&address=${ADDRESS}"
  ],
  "features": [],
  "infoURL": "https://arbitrum.io",
  "name": "Arbitrum Rinkeby",
  "nativeCurrency": {
    "name": "Arbitrum Rinkeby Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://arbitrum-rinkeby.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.arbitrum.io/rpc"
  ],
  "shortName": "arb-rinkeby",
  "slug": "arbitrum-rinkeby",
  "testnet": true
} as const satisfies Chain;