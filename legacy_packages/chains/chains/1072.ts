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
  "icon": {
    "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "infoURL": "https://shimmer.network",
  "name": "ShimmerEVM Testnet Deprecated 1072",
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 6
  },
  "networkId": 1072,
  "rpc": [],
  "shortName": "shimmerevm-testnet-deprecated-1072",
  "slip44": 1,
  "slug": "shimmerevm-testnet-deprecated-1072",
  "status": "deprecated",
  "testnet": true,
  "title": "ShimmerEVM Testnet Deprecated 1072"
} as const satisfies Chain;