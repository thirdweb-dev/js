import type { Chain } from "../src/types";
export default {
  "chain": "Flow",
  "chainId": 545,
  "explorers": [
    {
      "name": "Flow Diver",
      "url": "https://testnet.flowdiver.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://testnet-faucet.onflow.org"
  ],
  "icon": {
    "url": "ipfs://QmQFugEvsfU3ARjjJ7YRLJwSxMfTk54WWzrofekTRBKFaC",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://developers.flow.com/evm/about",
  "name": "Testnet",
  "nativeCurrency": {
    "name": "FLOW",
    "symbol": "FLOW",
    "decimals": 18
  },
  "networkId": 545,
  "rpc": [
    "https://545.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.evm.nodes.onflow.org"
  ],
  "shortName": "flow-testnet",
  "slug": "testnet",
  "testnet": true
} as const satisfies Chain;