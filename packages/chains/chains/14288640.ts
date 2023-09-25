import type { Chain } from "../src/types";
export default {
  "chainId": 14288640,
  "chain": "anduschain",
  "name": "Anduschain Mainnet",
  "rpc": [
    "https://anduschain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.anduschain.io/rpc",
    "wss://rpc.anduschain.io/ws"
  ],
  "slug": "anduschain",
  "faucets": [],
  "nativeCurrency": {
    "name": "DAON",
    "symbol": "DEB",
    "decimals": 18
  },
  "infoURL": "https://anduschain.io/",
  "shortName": "anduschain-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "anduschain explorer",
      "url": "https://explorer.anduschain.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;