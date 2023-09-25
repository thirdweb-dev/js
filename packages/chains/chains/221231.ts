import type { Chain } from "../src/types";
export default {
  "chainId": 221231,
  "chain": "REAP",
  "name": "Reapchain Testnet",
  "rpc": [
    "https://reapchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-eth.reapchain.org"
  ],
  "slug": "reapchain-testnet",
  "icon": {
    "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [
    "http://faucet.reapchain.com"
  ],
  "nativeCurrency": {
    "name": "test-Reap",
    "symbol": "tREAP",
    "decimals": 18
  },
  "infoURL": "https://reapchain.com",
  "shortName": "reap-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Reapchain Testnet Dashboard",
      "url": "https://test-dashboard.reapchain.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;