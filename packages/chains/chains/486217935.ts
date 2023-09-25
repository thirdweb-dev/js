import type { Chain } from "../src/types";
export default {
  "chainId": 486217935,
  "chain": "GTH",
  "name": "Gather Devnet Network",
  "rpc": [
    "https://gather-devnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.gather.network"
  ],
  "slug": "gather-devnet-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "shortName": "dGTH",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://devnet-explorer.gather.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;