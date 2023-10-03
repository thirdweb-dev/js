import type { Chain } from "../src/types";
export default {
  "chain": "ShimmerEVM",
  "chainId": 1072,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.testnet.shimmer.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://evm-toolkit.evm.testnet.shimmer.network",
    "https://evm-faucet.testnet.shimmer.network"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "infoURL": "https://shimmer.network",
  "name": "ShimmerEVM Testnet",
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://shimmerevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.testnet.shimmer.network"
  ],
  "shortName": "shimmerevm-testnet",
  "slug": "shimmerevm-testnet",
  "testnet": true
} as const satisfies Chain;