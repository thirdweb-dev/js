import type { Chain } from "../src/types";
export default {
  "chain": "Sei",
  "chainId": 1329,
  "explorers": [
    {
      "name": "Seitrace",
      "url": "https://seitrace.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreia2tiurhfkc2lifytbpv356d4rfmqoivzrepg2wsrqwrqgbb4bp7a",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://www.sei.io",
  "name": "Sei Network",
  "nativeCurrency": {
    "name": "Sei",
    "symbol": "SEI",
    "decimals": 18
  },
  "networkId": 1329,
  "rpc": [
    "https://1329.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.sei-apis.com",
    "wss://evm-ws.sei-apis.com"
  ],
  "shortName": "sei",
  "slug": "sei-network",
  "testnet": false
} as const satisfies Chain;