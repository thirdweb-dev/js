import type { Chain } from "../src/types";
export default {
  "chain": "JONO11",
  "chainId": 20765,
  "explorers": [
    {
      "name": "JONO11 Explorer",
      "url": "https://subnets-test.avax.network/jono11",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "name": "Jono11 Subnet",
  "nativeCurrency": {
    "name": "Jono11 Token",
    "symbol": "JONO",
    "decimals": 18
  },
  "networkId": 20765,
  "rpc": [
    "https://20765.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/jono11/testnet/rpc"
  ],
  "shortName": "jono11",
  "slug": "jono11-subnet",
  "testnet": true
} as const satisfies Chain;