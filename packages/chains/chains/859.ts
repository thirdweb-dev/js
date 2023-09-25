import type { Chain } from "../src/types";
export default {
  "chainId": 859,
  "chain": "ZeethChainDev",
  "name": "Zeeth Chain Dev",
  "rpc": [
    "https://zeeth-chain-dev.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.zeeth.io"
  ],
  "slug": "zeeth-chain-dev",
  "faucets": [],
  "nativeCurrency": {
    "name": "Zeeth Token",
    "symbol": "ZTH",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "zeethdev",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Zeeth Explorer Dev",
      "url": "https://explorer.dev.zeeth.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;