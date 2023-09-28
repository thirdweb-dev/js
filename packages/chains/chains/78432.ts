import type { Chain } from "../src/types";
export default {
  "name": "Conduit Subnet",
  "chain": "CONDUIT",
  "rpc": [
    "https://conduit-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/conduit/testnet/rpc"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CON",
    "symbol": "CON",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network",
  "shortName": "conduit",
  "chainId": 78432,
  "networkId": 78432,
  "explorers": [
    {
      "name": "CONDUIT Explorer",
      "url": "https://subnets-test.avax.network/conduit",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "conduit-subnet"
} as const satisfies Chain;