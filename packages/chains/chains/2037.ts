import type { Chain } from "../src/types";
export default {
  "name": "Kiwi Subnet",
  "chain": "KIWI",
  "rpc": [
    "https://kiwi-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/kiwi/testnet/rpc"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shrapgas",
    "symbol": "SHRAP",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "kiwi",
  "chainId": 2037,
  "networkId": 2037,
  "explorers": [
    {
      "name": "KIWI Explorer",
      "url": "https://subnets-test.avax.network/kiwi",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kiwi-subnet"
} as const satisfies Chain;