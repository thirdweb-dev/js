import type { Chain } from "../src/types";
export default {
  "name": "Bulletin Subnet",
  "chain": "BULLETIN",
  "rpc": [
    "https://bulletin-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/bulletin/testnet/rpc"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BLT",
    "symbol": "BLT",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network",
  "shortName": "bulletin",
  "chainId": 78431,
  "networkId": 78431,
  "explorers": [
    {
      "name": "BULLETIN Explorer",
      "url": "https://subnets-test.avax.network/bulletin",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bulletin-subnet"
} as const satisfies Chain;