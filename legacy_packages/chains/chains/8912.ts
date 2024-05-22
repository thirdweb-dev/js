import type { Chain } from "../src/types";
export default {
  "chain": "ALG",
  "chainId": 8912,
  "explorers": [
    {
      "name": "algscan",
      "url": "https://scan.test.algen.network",
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
  "name": "Algen Testnet",
  "nativeCurrency": {
    "name": "ALG",
    "symbol": "ALG",
    "decimals": 18
  },
  "networkId": 8912,
  "rpc": [
    "https://8912.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.algen.network"
  ],
  "shortName": "algTest",
  "slug": "algen-testnet",
  "testnet": true
} as const satisfies Chain;