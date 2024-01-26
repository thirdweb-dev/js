import type { Chain } from "../src/types";
export default {
  "chain": "shrapnel",
  "chainId": 2044,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.shrapnel.com/",
  "name": "Shrapnel Subnet",
  "nativeCurrency": {
    "name": "Shrapnel Gas Token",
    "symbol": "SHRAPG",
    "decimals": 18
  },
  "networkId": 2044,
  "rpc": [
    "https://shrapnel-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2044.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/shrapnel/mainnet/rpc"
  ],
  "shortName": "Shrapnel",
  "slug": "shrapnel-subnet",
  "testnet": false
} as const satisfies Chain;