import type { Chain } from "../src/types";
export default {
  "chainId": 78431,
  "chain": "BULLETIN",
  "name": "Bulletin Subnet",
  "rpc": [
    "https://bulletin-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/bulletin/testnet/rpc"
  ],
  "slug": "bulletin-subnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "BLT",
    "symbol": "BLT",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network",
  "shortName": "bulletin",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "BULLETIN Explorer",
      "url": "https://subnets-test.avax.network/bulletin",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;