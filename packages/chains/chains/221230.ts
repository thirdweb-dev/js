import type { Chain } from "../src/types";
export default {
  "name": "Reapchain Mainnet",
  "chain": "REAP",
  "rpc": [
    "https://reapchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.reapchain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Reap",
    "symbol": "REAP",
    "decimals": 18
  },
  "features": [],
  "infoURL": "https://reapchain.com",
  "shortName": "reap",
  "chainId": 221230,
  "networkId": 221230,
  "icon": {
    "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Reapchain Dashboard",
      "url": "https://dashboard.reapchain.org",
      "icon": {
        "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
        "width": 256,
        "height": 256,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "reapchain"
} as const satisfies Chain;