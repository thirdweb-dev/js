import type { Chain } from "../src/types";
export default {
  "name": "Carbon EVM",
  "chain": "Carbon",
  "icon": {
    "url": "ipfs://QmQUHqi1gyuTuKmJQHqt9EyhN1FPmmmLNUK8u93nMGrxAy",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "rpc": [
    "https://carbon-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-api.carbon.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "swth",
    "symbol": "SWTH",
    "decimals": 18
  },
  "infoURL": "https://carbon.network/",
  "shortName": "carbon",
  "chainId": 9790,
  "networkId": 9790,
  "explorers": [],
  "testnet": false,
  "slug": "carbon-evm"
} as const satisfies Chain;