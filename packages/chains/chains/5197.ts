import type { Chain } from "../src/types";
export default {
  "chain": "ESN",
  "chainId": 5197,
  "explorers": [],
  "faucets": [],
  "features": [],
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
  "redFlags": [],
  "rpc": [
    "https://eraswap.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eraswap.network",
    "https://rpc-mumbai.mainnet.eraswap.network"
  ],
  "shortName": "es",
  "slug": "eraswap",
  "testnet": false
} as const satisfies Chain;