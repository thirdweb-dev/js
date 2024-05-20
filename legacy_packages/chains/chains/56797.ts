import type { Chain } from "../src/types";
export default {
  "chain": "DOID",
  "chainId": 56797,
  "explorers": [
    {
      "name": "DOID Testnet Scan",
      "url": "https://scan.testnet.doid.tech",
      "standard": "EIP3091"
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