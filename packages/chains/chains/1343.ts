import type { Chain } from "../src/types";
export default {
  "chain": "BLITZ",
  "chainId": 1343,
  "explorers": [
    {
      "name": "BLITZ Explorer",
      "url": "https://subnets-test.avax.network/blitz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://blitz.gg",
  "name": "Blitz Subnet",
  "nativeCurrency": {
    "name": "BLITZ GAS",
    "symbol": "BGAS",
    "decimals": 18
  },
  "networkId": 1343,
  "rpc": [
    "https://blitz-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1343.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/blitz/testnet/rpc"
  ],
  "shortName": "blitz",
  "slug": "blitz-subnet",
  "testnet": true
} as const satisfies Chain;