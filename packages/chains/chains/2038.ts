import type { Chain } from "../src/types";
export default {
  "chain": "SHRAPNEL",
  "chainId": 2038,
  "explorers": [
    {
      "name": "SHRAPNEL Explorer",
      "url": "https://subnets-test.avax.network/shrapnel",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.shrapnel.com/",
  "name": "Shrapnel Testnet",
  "nativeCurrency": {
    "name": "SHRAPG",
    "symbol": "SHRAPG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://shrapnel-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/shrapnel/testnet/rpc"
  ],
  "shortName": "shraptest",
  "slug": "shrapnel-testnet",
  "testnet": true
} as const satisfies Chain;