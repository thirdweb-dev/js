import type { Chain } from "../src/types";
export default {
  "chain": "XFI",
  "chainId": 4157,
  "explorers": [
    {
      "name": "CrossFi Testnet Scan",
      "url": "https://test.xfiscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbRJzDeAdMkEXkqDwBwezpUxyjTPHZ2iXEomqKPvWZcWE",
        "width": 40,
        "height": 42,
        "format": "svg"
      }
    },
    {
      "name": "Scan Testnet",
      "url": "https://scan.testnet.ms/",
      "standard": "EIP1559"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbRJzDeAdMkEXkqDwBwezpUxyjTPHZ2iXEomqKPvWZcWE",
    "width": 40,
    "height": 42,
    "format": "svg"
  },
  "infoURL": "https://crossfi.org",
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
    "https://rpc.testnet.ms/",
    "https://rpc.testnet.ms"
  ],
  "shortName": "XFI",
  "slip44": 1,
  "slug": "crossfi-testnet",
  "testnet": true,
  "title": "https://scan.testnet.ms/"
} as const satisfies Chain;