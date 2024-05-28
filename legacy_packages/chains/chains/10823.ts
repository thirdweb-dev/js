import type { Chain } from "../src/types";
export default {
  "chain": "CCP",
  "chainId": 10823,
  "explorers": [
    {
      "name": "CCP Explorer",
      "url": "https://cryptocoinpay.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.cryptocoinpay.co",
  "name": "CryptoCoinPay",
  "nativeCurrency": {
    "name": "CryptoCoinPay",
    "symbol": "CCP",
    "decimals": 18
  },
  "networkId": 10823,
  "rpc": [
    "https://10823.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://node106.cryptocoinpay.info:8545",
    "ws://node106.cryptocoinpay.info:8546"
  ],
  "shortName": "CCP",
  "slug": "cryptocoinpay",
  "testnet": false
} as const satisfies Chain;