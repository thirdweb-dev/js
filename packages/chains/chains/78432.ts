import type { Chain } from "../src/types";
export default {
  "chain": "CONDUIT",
  "chainId": 78432,
  "explorers": [
    {
      "name": "CONDUIT Explorer",
      "url": "https://subnets-test.avax.network/conduit",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.avax.network",
  "name": "Conduit Subnet",
  "nativeCurrency": {
    "name": "CON",
    "symbol": "CON",
    "decimals": 18
  },
  "networkId": 78432,
  "rpc": [
    "https://78432.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/conduit/testnet/rpc"
  ],
  "shortName": "conduit",
  "slip44": 1,
  "slug": "conduit-subnet",
  "testnet": true
} as const satisfies Chain;