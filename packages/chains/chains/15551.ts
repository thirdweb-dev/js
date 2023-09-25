import type { Chain } from "../src/types";
export default {
  "chainId": 15551,
  "chain": "LoopNetwork",
  "name": "LoopNetwork Mainnet",
  "rpc": [
    "https://loopnetwork.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnetloop.com"
  ],
  "slug": "loopnetwork",
  "faucets": [],
  "nativeCurrency": {
    "name": "LOOP",
    "symbol": "LOOP",
    "decimals": 18
  },
  "infoURL": "http://theloopnetwork.org/",
  "shortName": "loop",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "loopscan",
      "url": "http://explorer.mainnetloop.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;