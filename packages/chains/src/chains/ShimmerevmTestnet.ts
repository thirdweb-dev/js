import type { Chain } from "../types";
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
    "decimals": 6
  },
  "networkId": 1072,
  "rpc": [
    "https://shimmerevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1072.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.testnet.shimmer.network"
  ],
  "shortName": "shimmerevm-testnet",
  "slug": "shimmerevm-testnet",
  "testnet": true,
  "title": "ShimmerEVM Testnet"
} as const satisfies Chain;