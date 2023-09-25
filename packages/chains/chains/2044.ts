import type { Chain } from "../src/types";
export default {
  "chainId": 2044,
  "chain": "shrapnel",
  "name": "Shrapnel Subnet",
  "rpc": [
    "https://shrapnel-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/shrapnel/mainnet/rpc"
  ],
  "slug": "shrapnel-subnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Shrapnel Gas Token",
    "symbol": "SHRAPG",
    "decimals": 18
  },
  "infoURL": "https://www.shrapnel.com/",
  "shortName": "Shrapnel",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;