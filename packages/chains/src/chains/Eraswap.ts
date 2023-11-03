import type { Chain } from "../types";
export default {
  "chain": "ESN",
  "chainId": 5197,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmV1wZ1RVXeD7216aiVBpLkbBBHWNuoTvcSzpVQsqi2uaH",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://eraswap.info/",
  "name": "EraSwap Mainnet",
  "nativeCurrency": {
    "name": "EraSwap",
    "symbol": "ES",
    "decimals": 18
  },
  "networkId": 5197,
  "rpc": [
    "https://eraswap.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5197.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eraswap.network",
    "https://rpc-mumbai.mainnet.eraswap.network"
  ],
  "shortName": "es",
  "slug": "eraswap",
  "testnet": false
} as const satisfies Chain;