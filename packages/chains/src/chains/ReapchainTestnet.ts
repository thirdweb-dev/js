import type { Chain } from "../types";
export default {
  "chain": "REAP",
  "chainId": 221231,
  "explorers": [
    {
      "name": "Reapchain Testnet Dashboard",
      "url": "https://test-dashboard.reapchain.org",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "http://faucet.reapchain.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://reapchain.com",
  "name": "Reapchain Testnet",
  "nativeCurrency": {
    "name": "test-Reap",
    "symbol": "tREAP",
    "decimals": 18
  },
  "networkId": 221231,
  "rpc": [
    "https://reapchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://221231.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-eth.reapchain.org"
  ],
  "shortName": "reap-testnet",
  "slug": "reapchain-testnet",
  "testnet": true
} as const satisfies Chain;