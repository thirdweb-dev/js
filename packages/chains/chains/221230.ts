import type { Chain } from "../src/types";
export default {
  "chainId": 221230,
  "chain": "REAP",
  "name": "Reapchain Mainnet",
  "rpc": [
    "https://reapchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth.reapchain.org"
  ],
  "slug": "reapchain",
  "icon": {
    "url": "ipfs://QmevQ8jmDWHmdnUQg6BpoMwVB3NhpzS75adbMnKL78Ls2h",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Reap",
    "symbol": "REAP",
    "decimals": 18
  },
  "infoURL": "https://reapchain.com",
  "shortName": "reap",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Reapchain Dashboard",
      "url": "https://dashboard.reapchain.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;