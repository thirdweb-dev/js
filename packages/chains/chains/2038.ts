import type { Chain } from "../src/types";
export default {
  "name": "Shrapnel Testnet",
  "chain": "SHRAPNEL",
  "rpc": [
    "https://shrapnel-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/shrapnel/testnet/rpc"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SHRAPG",
    "symbol": "SHRAPG",
    "decimals": 18
  },
  "infoURL": "https://www.shrapnel.com/",
  "shortName": "shraptest",
  "chainId": 2038,
  "networkId": 2038,
  "explorers": [
    {
      "name": "SHRAPNEL Explorer",
      "url": "https://subnets-test.avax.network/shrapnel",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "shrapnel-testnet"
} as const satisfies Chain;