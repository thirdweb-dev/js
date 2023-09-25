import type { Chain } from "../src/types";
export default {
  "chainId": 9528,
  "chain": "QET",
  "name": "QEasyWeb3 Testnet",
  "rpc": [
    "https://qeasyweb3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://qeasyweb3.com"
  ],
  "slug": "qeasyweb3-testnet",
  "faucets": [
    "http://faucet.qeasyweb3.com"
  ],
  "nativeCurrency": {
    "name": "QET",
    "symbol": "QET",
    "decimals": 18
  },
  "infoURL": "https://www.qeasyweb3.com",
  "shortName": "QETTest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "QEasyWeb3 Explorer",
      "url": "https://www.qeasyweb3.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;