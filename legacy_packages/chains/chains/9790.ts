import type { Chain } from "../src/types";
export default {
  "chain": "Carbon",
  "chainId": 9790,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQUHqi1gyuTuKmJQHqt9EyhN1FPmmmLNUK8u93nMGrxAy",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "infoURL": "https://carbon.network/",
  "name": "Carbon EVM",
  "nativeCurrency": {
    "name": "swth",
    "symbol": "SWTH",
    "decimals": 18
  },
  "networkId": 9790,
  "rpc": [
    "https://9790.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-api.carbon.network/"
  ],
  "shortName": "carbon",
  "slug": "carbon-evm",
  "testnet": false
} as const satisfies Chain;