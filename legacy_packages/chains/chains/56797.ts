import type { Chain } from "../src/types";
export default {
  "chain": "DOID",
  "chainId": 56797,
  "explorers": [
    {
      "name": "DOID Testnet Scan",
      "url": "https://scan.testnet.doid.tech",
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
  "name": "DOID Testnet",
  "nativeCurrency": {
    "name": "DOID",
    "symbol": "DOID",
    "decimals": 18
  },
  "networkId": 56797,
  "rpc": [
    "https://56797.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.doid.tech"
  ],
  "shortName": "doidTestnet",
  "slug": "doid-testnet",
  "testnet": true
} as const satisfies Chain;