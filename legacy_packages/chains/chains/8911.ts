import type { Chain } from "../src/types";
export default {
  "chain": "ALG",
  "chainId": 8911,
  "explorers": [
    {
      "name": "algscan",
      "url": "https://scan.algen.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdSNGv2Atdaexawc4L3uAL7dL5aDREgWwPo2HNayQbpLm",
        "width": 323,
        "height": 323,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdSNGv2Atdaexawc4L3uAL7dL5aDREgWwPo2HNayQbpLm",
    "width": 323,
    "height": 323,
    "format": "png"
  },
  "infoURL": "https://www.algen.network",
  "name": "Algen",
  "nativeCurrency": {
    "name": "ALG",
    "symbol": "ALG",
    "decimals": 18
  },
  "networkId": 8911,
  "rpc": [
    "https://8911.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.algen.network"
  ],
  "shortName": "alg",
  "slug": "algen",
  "testnet": false
} as const satisfies Chain;