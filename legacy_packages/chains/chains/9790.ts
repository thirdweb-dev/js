import type { Chain } from "../src/types";
export default {
  "chain": "Carbon",
  "chainId": 9790,
  "explorers": [],
  "faucets": [],
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