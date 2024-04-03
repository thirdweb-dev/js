import type { Chain } from "../src/types";
export default {
  "chain": "REAP",
  "chainId": 221230,
  "explorers": [
    {
      "name": "Reapchain Dashboard",
      "url": "https://dashboard.reapchain.org",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://reapchain.com",
  "name": "Reapchain Mainnet",
  "nativeCurrency": {
    "name": "Reap",
    "symbol": "REAP",
    "decimals": 18
  },
  "networkId": 221230,
  "rpc": [
    "https://221230.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.reapchain.org"
  ],
  "shortName": "reap",
  "slug": "reapchain",
  "testnet": false
} as const satisfies Chain;