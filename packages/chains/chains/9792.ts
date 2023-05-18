import type { Chain } from "../src/types";
export default {
  "name": "Carbon EVM Testnet",
  "chain": "Carbon",
  "icon": {
    "url": "ipfs://QmQUHqi1gyuTuKmJQHqt9EyhN1FPmmmLNUK8u93nMGrxAy",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "rpc": [
    "https://carbon-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-evm-api.carbon.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "swth",
    "symbol": "SWTH",
    "decimals": 18
  },
  "infoURL": "https://carbon.network/",
  "shortName": "carbon-testnet",
  "chainId": 9792,
  "networkId": 9792,
  "explorers": [],
  "testnet": true,
  "slug": "carbon-evm-testnet"
} as const satisfies Chain;