import type { Chain } from "../src/types";
export default {
  "chain": "QET",
  "chainId": 9528,
  "explorers": [
    {
      "name": "QEasyWeb3 Explorer",
      "url": "https://www.qeasyweb3.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://faucet.qeasyweb3.com"
  ],
  "features": [],
  "infoURL": "https://www.qeasyweb3.com",
  "name": "QEasyWeb3 Testnet",
  "nativeCurrency": {
    "name": "QET",
    "symbol": "QET",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://qeasyweb3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://qeasyweb3.com"
  ],
  "shortName": "QETTest",
  "slug": "qeasyweb3-testnet",
  "testnet": true
} as const satisfies Chain;