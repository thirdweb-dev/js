import type { Chain } from "../src/types";
export default {
  "chain": "ShimmerEVM",
  "chainId": 1071,
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
  "name": "ShimmerEVM Testnet Deprecated",
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 18
  },
  "networkId": 1071,
  "rpc": [],
  "shortName": "shimmerevm-testnet-deprecated",
  "slip44": 1,
  "slug": "shimmerevm-testnet-deprecated",
  "status": "deprecated",
  "testnet": true,
  "title": "ShimmerEVM Testnet Deprecated"
} as const satisfies Chain;