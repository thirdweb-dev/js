import type { Chain } from "../src/types";
export default {
  "name": "Zeeth Chain Dev",
  "chain": "ZeethChainDev",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zeeth Token",
    "symbol": "ZTH",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "zeethdev",
  "chainId": 859,
  "networkId": 859,
  "explorers": [
    {
      "name": "Zeeth Explorer Dev",
      "url": "https://explorer.dev.zeeth.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "zeeth-chain-dev"
} as const satisfies Chain;