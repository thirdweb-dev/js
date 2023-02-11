export default {
  "name": "CryptoCoinPay",
  "chain": "CCP",
  "rpc": [
    "https://cryptocoinpay.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://node106.cryptocoinpay.info:8545",
    "ws://node106.cryptocoinpay.info:8546"
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPw1ixYYeXvTiRWoCt2jWe4YMd3B5o7TzL18SBEHXvhXX",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "nativeCurrency": {
    "name": "CryptoCoinPay",
    "symbol": "CCP",
    "decimals": 18
  },
  "infoURL": "https://www.cryptocoinpay.co",
  "shortName": "CCP",
  "chainId": 10823,
  "networkId": 10823,
  "explorers": [
    {
      "name": "CCP Explorer",
      "url": "https://cryptocoinpay.info",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "cryptocoinpay"
} as const;