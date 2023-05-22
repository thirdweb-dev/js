import type { Chain } from "../src/types";
export default {
  "name": "WEMIX3.0 Mainnet",
  "chain": "WEMIX",
  "rpc": [
    "https://wemix3-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.wemix.com",
    "wss://ws.wemix.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "WEMIX",
    "symbol": "WEMIX",
    "decimals": 18
  },
  "infoURL": "https://wemix.com",
  "shortName": "wemix",
  "chainId": 1111,
  "networkId": 1111,
  "explorers": [
    {
      "name": "WEMIX Block Explorer",
      "url": "https://explorer.wemix.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "wemix3-0"
} as const satisfies Chain;