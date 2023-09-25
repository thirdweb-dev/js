import type { Chain } from "../src/types";
export default {
  "chainId": 78432,
  "chain": "CONDUIT",
  "name": "Conduit Subnet",
  "rpc": [
    "https://conduit-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/conduit/testnet/rpc"
  ],
  "slug": "conduit-subnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "CON",
    "symbol": "CON",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network",
  "shortName": "conduit",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "CONDUIT Explorer",
      "url": "https://subnets-test.avax.network/conduit",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;