import type { Chain } from "../src/types";
export default {
  "chainId": 9790,
  "chain": "Carbon",
  "name": "Carbon EVM",
  "rpc": [
    "https://carbon-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-api.carbon.network/"
  ],
  "slug": "carbon-evm",
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
  "shortName": "carbon",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;