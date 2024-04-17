import type { Chain } from "../src/types";
export default {
  "chain": "Safe(AnWang)",
  "chainId": 6666666,
  "explorers": [
    {
      "name": "Safe(AnWang) Testnet Explorer",
      "url": "http://safe4-testnet.anwang.com",
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
  "name": "Safe(AnWang) Testnet",
  "nativeCurrency": {
    "name": "SAFE(AnWang)",
    "symbol": "SAFE",
    "decimals": 18
  },
  "networkId": 6666666,
  "rpc": [
    "https://6666666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.anwang.com"
  ],
  "shortName": "SafeTestnet",
  "slug": "safe-anwang-testnet",
  "testnet": true
} as const satisfies Chain;