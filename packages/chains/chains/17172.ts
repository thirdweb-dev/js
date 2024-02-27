import type { Chain } from "../src/types";
export default {
  "chain": "ECLIPSE",
  "chainId": 17172,
  "explorers": [
    {
      "name": "ECLIPSE Explorer",
      "url": "https://subnets-test.avax.network/eclipse",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "http://eclipsenet.io",
  "name": "Eclipse Subnet",
  "nativeCurrency": {
    "name": "Eclipse",
    "symbol": "ECLP",
    "decimals": 16
  },
  "networkId": 17172,
  "rpc": [
    "https://17172.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/eclipse/testnet/rpc"
  ],
  "shortName": "eclipse",
  "slug": "eclipse-subnet",
  "testnet": true
} as const satisfies Chain;