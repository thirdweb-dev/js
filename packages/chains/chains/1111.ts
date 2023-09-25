import type { Chain } from "../src/types";
export default {
  "chainId": 1111,
  "chain": "WEMIX",
  "name": "WEMIX3.0 Mainnet",
  "rpc": [
    "https://wemix3-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.wemix.com",
    "wss://ws.wemix.com"
  ],
  "slug": "wemix3-0",
  "faucets": [],
  "nativeCurrency": {
    "name": "WEMIX",
    "symbol": "WEMIX",
    "decimals": 18
  },
  "infoURL": "https://wemix.com",
  "shortName": "wemix",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "WEMIX Block Explorer",
      "url": "https://explorer.wemix.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;