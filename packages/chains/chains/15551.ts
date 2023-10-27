import type { Chain } from "../src/types";
export default {
  "chain": "LoopNetwork",
  "chainId": 15551,
  "explorers": [
    {
      "name": "loopscan",
      "url": "http://explorer.mainnetloop.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "http://theloopnetwork.org/",
  "name": "LoopNetwork Mainnet",
  "nativeCurrency": {
    "name": "LOOP",
    "symbol": "LOOP",
    "decimals": 18
  },
  "networkId": 15551,
  "rpc": [
    "https://loopnetwork.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://15551.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnetloop.com"
  ],
  "shortName": "loop",
  "slug": "loopnetwork",
  "testnet": false
} as const satisfies Chain;