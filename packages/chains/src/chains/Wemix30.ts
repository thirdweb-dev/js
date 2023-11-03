import type { Chain } from "../types";
export default {
  "chain": "WEMIX",
  "chainId": 1111,
  "explorers": [
    {
      "name": "WEMIX Block Explorer",
      "url": "https://explorer.wemix.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://wemix.com",
  "name": "WEMIX3.0 Mainnet",
  "nativeCurrency": {
    "name": "WEMIX",
    "symbol": "WEMIX",
    "decimals": 18
  },
  "networkId": 1111,
  "rpc": [
    "https://wemix3-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1111.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.wemix.com",
    "wss://ws.wemix.com"
  ],
  "shortName": "wemix",
  "slug": "wemix3-0",
  "testnet": false
} as const satisfies Chain;