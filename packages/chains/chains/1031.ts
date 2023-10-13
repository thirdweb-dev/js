import type { Chain } from "../src/types";
export default {
  "chain": "Proxy Network",
  "chainId": 1031,
  "explorers": [
    {
      "name": "proxy network testnet",
      "url": "http://testnet-explorer.theproxy.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://theproxy.network",
  "name": "Proxy Network Testnet",
  "nativeCurrency": {
    "name": "PRX",
    "symbol": "PRX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://proxy-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://128.199.94.183:8041"
  ],
  "shortName": "prx",
  "slug": "proxy-network-testnet",
  "testnet": true
} as const satisfies Chain;