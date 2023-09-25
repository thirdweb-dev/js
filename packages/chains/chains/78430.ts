import type { Chain } from "../src/types";
export default {
  "chainId": 78430,
  "chain": "AMPLIFY",
  "name": "Amplify Subnet",
  "rpc": [
    "https://amplify-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/amplify/testnet/rpc"
  ],
  "slug": "amplify-subnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "AMP",
    "symbol": "AMP",
    "decimals": 18
  },
  "infoURL": "https://www.avax.network",
  "shortName": "amplify",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "AMPLIFY Explorer",
      "url": "https://subnets-test.avax.network/amplify",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;