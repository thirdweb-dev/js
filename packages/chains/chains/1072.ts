import type { Chain } from "../src/types";
export default {
  "chainId": 1072,
  "chain": "ShimmerEVM",
  "name": "ShimmerEVM Testnet",
  "rpc": [
    "https://shimmerevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.testnet.shimmer.network"
  ],
  "slug": "shimmerevm-testnet",
  "icon": {
    "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "faucets": [
    "https://evm-toolkit.evm.testnet.shimmer.network",
    "https://evm-faucet.testnet.shimmer.network"
  ],
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 6
  },
  "infoURL": "https://shimmer.network",
  "shortName": "shimmerevm-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.testnet.shimmer.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;