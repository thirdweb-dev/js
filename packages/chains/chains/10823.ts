import type { Chain } from "../src/types";
export default {
  "chainId": 10823,
  "chain": "CCP",
  "name": "CryptoCoinPay",
  "rpc": [
    "https://cryptocoinpay.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://node106.cryptocoinpay.info:8545",
    "ws://node106.cryptocoinpay.info:8546"
  ],
  "slug": "cryptocoinpay",
  "icon": {
    "url": "ipfs://QmPw1ixYYeXvTiRWoCt2jWe4YMd3B5o7TzL18SBEHXvhXX",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "CryptoCoinPay",
    "symbol": "CCP",
    "decimals": 18
  },
  "infoURL": "https://www.cryptocoinpay.co",
  "shortName": "CCP",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "CCP Explorer",
      "url": "https://cryptocoinpay.info",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;