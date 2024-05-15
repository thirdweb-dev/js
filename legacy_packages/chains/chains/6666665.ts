import type { Chain } from "../src/types";
export default {
  "chain": "Safe(AnWang)",
  "chainId": 6666665,
  "explorers": [
    {
      "name": "Safe(AnWang) Explorer",
      "url": "http://safe4.anwang.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmahJhdaLfGwBStQ9q9K4Mc73vLNqFV1otWCsT2ZKsMavv",
        "width": 768,
        "height": 768,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmahJhdaLfGwBStQ9q9K4Mc73vLNqFV1otWCsT2ZKsMavv",
    "width": 768,
    "height": 768,
    "format": "png"
  },
  "infoURL": "https://www.anwang.com",
  "name": "Safe(AnWang) Mainnet",
  "nativeCurrency": {
    "name": "SAFE(AnWang)",
    "symbol": "SAFE",
    "decimals": 18
  },
  "networkId": 6666665,
  "rpc": [
    "https://6666665.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.anwang.com"
  ],
  "shortName": "SafeMainnet",
  "slug": "safe-anwang",
  "testnet": false
} as const satisfies Chain;