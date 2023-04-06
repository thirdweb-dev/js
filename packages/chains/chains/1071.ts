import type { Chain } from "../src/types";
export default {
  "name": "ShimmerEVM Testnet",
  "title": "ShimmerEVM Testnet",
  "chain": "ShimmerEVM",
  "icon": {
    "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "rpc": [
    "https://shimmerevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.testnet.shimmer.network"
  ],
  "faucets": [
    "https://evm-toolkit.evm.testnet.shimmer.network",
    "https://evm-faucet.testnet.shimmer.network"
  ],
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 18
  },
  "infoURL": "https://shimmer.network",
  "shortName": "shimmerevm-testnet",
  "chainId": 1071,
  "networkId": 1071,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.testnet.shimmer.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "shimmerevm-testnet"
} as const satisfies Chain;