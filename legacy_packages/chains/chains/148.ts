import type { Chain } from "../src/types";
export default {
  "chain": "ShimmerEVM",
  "chainId": 148,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.shimmer.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://shimmer.network",
  "name": "ShimmerEVM",
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 18
  },
  "networkId": 148,
  "rpc": [
    "https://148.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.shimmer.network"
  ],
  "shortName": "shimmerevm",
  "slug": "shimmerevm",
  "testnet": false,
  "title": "ShimmerEVM"
} as const satisfies Chain;