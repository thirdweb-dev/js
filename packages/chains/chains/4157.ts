import type { Chain } from "../src/types";
export default {
  "chain": "XFI",
  "chainId": 4157,
  "explorers": [
    {
      "name": "Scan Testnet",
      "url": "https://scan.testnet.ms/",
      "standard": "EIP1559"
    }
  ],
  "faucets": [],
  "features": [],
  "name": "CrossFi Testnet",
  "nativeCurrency": {
    "name": "XFI",
    "symbol": "XFI",
    "decimals": 18
  },
  "networkId": 4157,
  "redFlags": [],
  "rpc": [
    "https://4157.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.ms/"
  ],
  "shortName": "XFI",
  "slug": "crossfi-testnet",
  "testnet": true,
  "title": "https://scan.testnet.ms/"
} as const satisfies Chain;