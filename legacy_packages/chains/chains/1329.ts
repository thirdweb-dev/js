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
  "features": [],
  "icon": {
    "url": "ipfs://QmTWt4P7guuSSK5GhpHpzsFh1ccB6PD9Vsk5sVhJYgjKFM",
    "width": 360,
    "height": 360,
    "format": "png"
  },
  "infoURL": "https://www.sei.io",
  "name": "Sei",
  "nativeCurrency": {
    "name": "Sei",
    "symbol": "Sei",
    "decimals": 18
  },
  "networkId": 1329,
  "redFlags": [],
  "rpc": [
    "https://1329.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.sei-apis.com",
    "wss://evm-ws.sei-apis.com"
  ],
  "shortName": "sei",
  "slug": "sei",
  "testnet": false
} as const satisfies Chain;