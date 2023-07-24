import type { Chain } from "../src/types";
export default {
  "name": "LoopNetwork Mainnet",
  "chain": "LoopNetwork",
  "rpc": [
    "https://loopnetwork.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnetloop.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LOOP",
    "symbol": "LOOP",
    "decimals": 18
  },
  "infoURL": "http://theloopnetwork.org/",
  "shortName": "loop",
  "chainId": 15551,
  "networkId": 15551,
  "explorers": [
    {
      "name": "loopscan",
      "url": "http://explorer.mainnetloop.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "loopnetwork"
} as const satisfies Chain;