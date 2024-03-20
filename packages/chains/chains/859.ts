import type { Chain } from "../src/types";
export default {
  "chain": "ZeethChainDev",
  "chainId": 859,
  "explorers": [
    {
      "name": "Zeeth Explorer Dev",
      "url": "https://explorer.dev.zeeth.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "name": "Zeeth Chain Dev",
  "nativeCurrency": {
    "name": "Zeeth Token",
    "symbol": "ZTH",
    "decimals": 18
  },
  "networkId": 859,
  "rpc": [
    "https://859.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.zeeth.io"
  ],
  "shortName": "zeethdev",
  "slug": "zeeth-chain-dev",
  "testnet": false
} as const satisfies Chain;