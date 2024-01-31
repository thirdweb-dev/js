import type { Chain } from "../src/types";
export default {
  "chain": "DOID",
  "chainId": 53277,
  "explorers": [
    {
      "name": "DOID Scan",
      "url": "https://scan.doid.tech",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXYSMyMnMvBf2F1ih6dTcRVUhmMnpzvmuP7vieLjmNQo5",
        "width": 41,
        "height": 52,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmXYSMyMnMvBf2F1ih6dTcRVUhmMnpzvmuP7vieLjmNQo5",
    "width": 41,
    "height": 52,
    "format": "svg"
  },
  "infoURL": "https://doid.tech",
  "name": "DOID",
  "nativeCurrency": {
    "name": "DOID",
    "symbol": "DOID",
    "decimals": 18
  },
  "networkId": 53277,
  "rpc": [
    "https://doid.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://53277.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.doid.tech"
  ],
  "shortName": "DOID",
  "slug": "doid",
  "testnet": false
} as const satisfies Chain;