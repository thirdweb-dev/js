import type { Chain } from "../src/types";
export default {
  "name": "Proxy Network Testnet",
  "chain": "Proxy Network",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "PRX",
    "symbol": "PRX",
    "decimals": 18
  },
  "infoURL": "https://theproxy.network",
  "shortName": "prx",
  "chainId": 1031,
  "networkId": 1031,
  "explorers": [
    {
      "name": "proxy network testnet",
      "url": "http://testnet-explorer.theproxy.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "proxy-network-testnet"
} as const satisfies Chain;