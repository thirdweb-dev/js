import type { Chain } from "../src/types";
export default {
  "chain": "anduschain",
  "chainId": 14288640,
  "explorers": [
    {
      "name": "anduschain explorer",
      "url": "https://explorer.anduschain.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://anduschain.io/",
  "name": "Anduschain Mainnet",
  "nativeCurrency": {
    "name": "DAON",
    "symbol": "DEB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://anduschain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.anduschain.io/rpc",
    "wss://rpc.anduschain.io/ws"
  ],
  "shortName": "anduschain-mainnet",
  "slug": "anduschain",
  "testnet": false
} as const satisfies Chain;