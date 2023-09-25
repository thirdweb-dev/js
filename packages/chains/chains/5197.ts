import type { Chain } from "../src/types";
export default {
  "chainId": 5197,
  "chain": "ESN",
  "name": "EraSwap Mainnet",
  "rpc": [
    "https://eraswap.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eraswap.network",
    "https://rpc-mumbai.mainnet.eraswap.network"
  ],
  "slug": "eraswap",
  "icon": {
    "url": "ipfs://QmV1wZ1RVXeD7216aiVBpLkbBBHWNuoTvcSzpVQsqi2uaH",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "EraSwap",
    "symbol": "ES",
    "decimals": 18
  },
  "infoURL": "https://eraswap.info/",
  "shortName": "es",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;