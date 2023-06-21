import type { Chain } from "../src/types";
export default {
  "name": "Shrapnel Subnet",
  "chain": "shrapnel",
  "rpc": [
    "https://shrapnel-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/shrapnel/mainnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shrapnel Gas Token",
    "symbol": "SHRAPG",
    "decimals": 18
  },
  "infoURL": "https://www.shrapnel.com/",
  "shortName": "Shrapnel",
  "chainId": 2044,
  "networkId": 2044,
  "testnet": false,
  "slug": "shrapnel-subnet"
} as const satisfies Chain;