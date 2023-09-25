import type { Chain } from "../src/types";
export default {
  "chainId": 9792,
  "chain": "Carbon",
  "name": "Carbon EVM Testnet",
  "rpc": [
    "https://carbon-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-evm-api.carbon.network/"
  ],
  "slug": "carbon-evm-testnet",
  "icon": {
    "url": "ipfs://QmQUHqi1gyuTuKmJQHqt9EyhN1FPmmmLNUK8u93nMGrxAy",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "swth",
    "symbol": "SWTH",
    "decimals": 18
  },
  "infoURL": "https://carbon.network/",
  "shortName": "carbon-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;