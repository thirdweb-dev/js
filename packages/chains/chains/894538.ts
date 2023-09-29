import type { Chain } from "../src/types";
export default {
  "name": "Thirdweb Ava Testnet",
  "chain": "TW",
  "rpc": [
    "https://thirdweb-ava-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/thirdweb/testnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TWT",
    "symbol": "TWT",
    "decimals": 18
  },
  "shortName": "tw-ava-testnet",
  "chainId": 894538,
  "networkId": 894538,
  "testnet": true,
  "slug": "thirdweb-ava-testnet"
} as const satisfies Chain;