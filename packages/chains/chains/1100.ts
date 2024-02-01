import type { Chain } from "../src/types";
export default {
  "chain": "Dymension",
  "chainId": 1100,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://dymension.xyz",
  "name": "Dymension",
  "nativeCurrency": {
    "name": "DYM",
    "symbol": "DYM",
    "decimals": 18
  },
  "networkId": 1100,
  "rpc": [
    "https://dymension.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dymension-evm.blockpi.network/v1/rpc/public"
  ],
  "shortName": "dymension",
  "slug": "dymension",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;