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
  "networkId": 421611,
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://421611.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.arbitrum.io/rpc"
  ],
  "shortName": "arb-rinkeby",
  "slip44": 1,
  "slug": "arbitrum-rinkeby",
  "status": "deprecated",
  "testnet": true,
  "title": "Arbitrum Testnet Rinkeby"
} as const satisfies Chain;