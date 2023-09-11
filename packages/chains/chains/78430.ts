import type { Chain } from "../src/types";
export default {
  "name": "Amplify Subnet",
  "chain": "AMPLIFY",
  "rpc": [
    "https://amplify-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/amplify/testnet/rpc"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AMP",
    "symbol": "AMP",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network",
  "shortName": "amplify",
  "chainId": 78430,
  "networkId": 78430,
  "explorers": [
    {
      "name": "AMPLIFY Explorer",
      "url": "https://subnets-test.avax.network/amplify",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "amplify-subnet"
} as const satisfies Chain;