import type { Chain } from "../src/types";
export default {
  "chain": "GTH",
  "chainId": 486217935,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://devnet-explorer.gather.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://gather.network",
  "name": "Gather Devnet Network",
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gather-devnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.gather.network"
  ],
  "shortName": "dGTH",
  "slug": "gather-devnet-network",
  "testnet": false
} as const satisfies Chain;