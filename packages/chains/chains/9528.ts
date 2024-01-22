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
  "infoURL": "https://www.qeasyweb3.com",
  "name": "QEasyWeb3 Testnet",
  "nativeCurrency": {
    "name": "QET",
    "symbol": "QET",
    "decimals": 18
  },
  "networkId": 9528,
  "rpc": [
    "https://qeasyweb3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9528.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://qeasyweb3.com"
  ],
  "shortName": "QETTest",
  "slip44": 1,
  "slug": "qeasyweb3-testnet",
  "testnet": true
} as const satisfies Chain;