import type { Chain } from "../src/types";
export default {
  "chain": "KIWI",
  "chainId": 2037,
  "explorers": [
    {
      "name": "KIWI Explorer",
      "url": "https://subnets-test.avax.network/kiwi",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "name": "Kiwi Subnet",
  "nativeCurrency": {
    "name": "Shrapgas",
    "symbol": "SHRAP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kiwi-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/kiwi/testnet/rpc"
  ],
  "shortName": "kiwi",
  "slug": "kiwi-subnet",
  "testnet": true
} as const satisfies Chain;