import type { Chain } from "../src/types";
export default {
  "chainId": 2037,
  "chain": "KIWI",
  "name": "Kiwi Subnet",
  "rpc": [
    "https://kiwi-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/kiwi/testnet/rpc"
  ],
  "slug": "kiwi-subnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Shrapgas",
    "symbol": "SHRAP",
    "decimals": 18
  },
  "shortName": "kiwi",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "KIWI Explorer",
      "url": "https://subnets-test.avax.network/kiwi",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;