import type { Chain } from "../src/types";
export default {
  "chainId": 1031,
  "chain": "Proxy Network",
  "name": "Proxy Network Testnet",
  "rpc": [
    "https://proxy-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://128.199.94.183:8041"
  ],
  "slug": "proxy-network-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "PRX",
    "symbol": "PRX",
    "decimals": 18
  },
  "infoURL": "https://theproxy.network",
  "shortName": "prx",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "proxy network testnet",
      "url": "http://testnet-explorer.theproxy.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;