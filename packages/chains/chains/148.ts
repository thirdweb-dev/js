import type { Chain } from "../src/types";
export default {
  "name": "ShimmerEVM Mainnet",
  "title": "ShimmerEVM Mainnet",
  "chain": "ShimmerEVM",
  "rpc": [
    "https://shimmerevm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.shimmer.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 18
  },
  "infoURL": "https://shimmer.network",
  "shortName": "shimmerevm-mainnet",
  "chainId": 148,
  "networkId": 148,
  "icon": {
    "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.shimmer.network",
      "icon": {
        "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
        "width": 720,
        "height": 720,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "shimmerevm"
} as const satisfies Chain;