import type { Chain } from "../src/types";
export default {
  "chain": "BULLETIN",
  "chainId": 78431,
  "explorers": [
    {
      "name": "BULLETIN Explorer",
      "url": "https://subnets-test.avax.network/bulletin",
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
  "name": "Bulletin Subnet",
  "nativeCurrency": {
    "name": "BLT",
    "symbol": "BLT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bulletin-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/bulletin/testnet/rpc"
  ],
  "shortName": "bulletin",
  "slug": "bulletin-subnet",
  "testnet": true
} as const satisfies Chain;