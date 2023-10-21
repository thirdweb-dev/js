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
  "features": [],
  "icon": {
    "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "infoURL": "https://shimmer.network",
  "name": "ShimmerEVM Mainnet",
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://shimmerevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.shimmer.network"
  ],
  "shortName": "shimmerevm-mainnet",
  "slug": "shimmerevm",
  "testnet": false
} as const satisfies Chain;