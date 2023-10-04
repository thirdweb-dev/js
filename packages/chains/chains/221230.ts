import type { Chain } from "../src/types";
export default {
  "chain": "REAP",
  "chainId": 221230,
  "explorers": [
    {
      "name": "Reapchain Dashboard",
      "url": "https://dashboard.reapchain.org",
      "standard": "none"
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
  "redFlags": [],
  "rpc": [
    "https://reapchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.reapchain.org"
  ],
  "shortName": "reap",
  "slug": "reapchain",
  "testnet": false
} as const satisfies Chain;