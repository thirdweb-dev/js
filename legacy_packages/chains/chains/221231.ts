import type { Chain } from "../src/types";
export default {
  "chain": "REAP",
  "chainId": 221231,
  "explorers": [
    {
      "name": "Reapchain Testnet Dashboard",
      "url": "https://test-dashboard.reapchain.org",
      "standard": "none"
    }
  ],
  "faucets": [
    "http://faucet.reapchain.com"
  ],
  "features": [],
  "infoURL": "https://reapchain.com",
  "name": "Reapchain Testnet",
  "nativeCurrency": {
    "name": "test-Reap",
    "symbol": "tREAP",
    "decimals": 18
  },
  "networkId": 221231,
  "rpc": [
    "https://221231.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-eth.reapchain.org"
  ],
  "shortName": "reap-testnet",
  "slip44": 1,
  "slug": "reapchain-testnet",
  "testnet": true
} as const satisfies Chain;