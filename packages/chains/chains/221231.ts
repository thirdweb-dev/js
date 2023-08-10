import type { Chain } from "../src/types";
export default {
  "name": "Reapchain Testnet",
  "chain": "REAP",
  "rpc": [
    "https://reapchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-eth.reapchain.org"
  ],
  "faucets": [
    "http://faucet.reapchain.com"
  ],
  "nativeCurrency": {
    "name": "test-Reap",
    "symbol": "tREAP",
    "decimals": 18
  },
  "features": [],
  "infoURL": "https://reapchain.com",
  "shortName": "reap-testnet",
  "chainId": 221231,
  "networkId": 221231,
  "icon": {
    "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Reapchain Testnet Dashboard",
      "url": "https://test-dashboard.reapchain.org",
      "icon": {
        "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
        "width": 256,
        "height": 256,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "reapchain-testnet"
} as const satisfies Chain;