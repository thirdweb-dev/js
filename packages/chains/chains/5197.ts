export default {
  "name": "EraSwap Mainnet",
  "chain": "ESN",
  "icon": {
    "url": "ipfs://QmV1wZ1RVXeD7216aiVBpLkbBBHWNuoTvcSzpVQsqi2uaH",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "rpc": [
    "https://eraswap.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eraswap.network",
    "https://rpc-mumbai.mainnet.eraswap.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EraSwap",
    "symbol": "ES",
    "decimals": 18
  },
  "infoURL": "https://eraswap.info/",
  "shortName": "es",
  "chainId": 5197,
  "networkId": 5197,
  "testnet": false,
  "slug": "eraswap"
} as const;