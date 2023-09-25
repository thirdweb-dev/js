import type { Chain } from "../src/types";
export default {
  "chainId": 2038,
  "chain": "SHRAPNEL",
  "name": "Shrapnel Testnet",
  "rpc": [
    "https://shrapnel-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/shrapnel/testnet/rpc"
  ],
  "slug": "shrapnel-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "SHRAPG",
    "symbol": "SHRAPG",
    "decimals": 18
  },
  "infoURL": "https://www.shrapnel.com/",
  "shortName": "shraptest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "SHRAPNEL Explorer",
      "url": "https://subnets-test.avax.network/shrapnel",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;