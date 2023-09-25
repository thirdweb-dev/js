import type { Chain } from "../src/types";
export default {
  "chainId": 148,
  "chain": "ShimmerEVM",
  "name": "ShimmerEVM Mainnet",
  "rpc": [
    "https://shimmerevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.shimmer.network"
  ],
  "slug": "shimmerevm",
  "icon": {
    "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 6
  },
  "infoURL": "https://shimmer.network",
  "shortName": "shimmerevm-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.shimmer.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;