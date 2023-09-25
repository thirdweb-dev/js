import type { Chain } from "../src/types";
export default {
  "chainId": 421611,
  "chain": "ETH",
  "name": "Arbitrum Rinkeby",
  "rpc": [
    "https://arbitrum-rinkeby.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.arbitrum.io/rpc"
  ],
  "slug": "arbitrum-rinkeby",
  "faucets": [
    "http://fauceth.komputing.org?chain=421611&address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Arbitrum Rinkeby Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io",
  "shortName": "arb-rinkeby",
  "testnet": true,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;