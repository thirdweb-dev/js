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
  "networkId": 2037,
  "rpc": [
    "https://2037.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/kiwi/testnet/rpc"
  ],
  "shortName": "kiwi",
  "slip44": 1,
  "slug": "kiwi-subnet",
  "testnet": true
} as const satisfies Chain;