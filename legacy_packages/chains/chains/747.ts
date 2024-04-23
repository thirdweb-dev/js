import type { Chain } from "../src/types";
export default {
  "chain": "Flow",
  "chainId": 747,
  "explorers": [
    {
      "name": "Flow Diver",
      "url": "https://flowdiver.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQFugEvsfU3ARjjJ7YRLJwSxMfTk54WWzrofekTRBKFaC",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://developers.flow.com/evm/about",
  "name": "Mainnet",
  "nativeCurrency": {
    "name": "FLOW",
    "symbol": "FLOW",
    "decimals": 18
  },
  "networkId": 747,
  "rpc": [
    "https://747.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.evm.nodes.onflow.org"
  ],
  "shortName": "flow-mainnet",
  "slug": "flow-mainnet",
  "testnet": false
} as const satisfies Chain;