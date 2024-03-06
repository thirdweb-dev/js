import type { Chain } from "../src/types";
export default {
  "chain": "Carbon",
  "chainId": 9792,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQUHqi1gyuTuKmJQHqt9EyhN1FPmmmLNUK8u93nMGrxAy",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "infoURL": "https://carbon.network/",
  "name": "Carbon EVM Testnet",
  "nativeCurrency": {
    "name": "swth",
    "symbol": "SWTH",
    "decimals": 18
  },
  "networkId": 9792,
  "rpc": [
    "https://9792.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-evm-api.carbon.network/"
  ],
  "shortName": "carbon-testnet",
  "slip44": 1,
  "slug": "carbon-evm-testnet",
  "testnet": true
} as const satisfies Chain;