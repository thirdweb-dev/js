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
  "rpc": [
    "https://arbitrum-rinkeby.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://421611.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.arbitrum.io/rpc"
  ],
  "shortName": "arb-rinkeby",
  "slug": "arbitrum-rinkeby",
  "testnet": true,
  "title": "Arbitrum Testnet Rinkeby"
} as const satisfies Chain;