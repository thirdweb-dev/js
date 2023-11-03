import type { Chain } from "../types";
export default {
  "chain": "AMPLIFY",
  "chainId": 78430,
  "explorers": [
    {
      "name": "AMPLIFY Explorer",
      "url": "https://subnets-test.avax.network/amplify",
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
  "name": "Amplify Subnet",
  "nativeCurrency": {
    "name": "AMP",
    "symbol": "AMP",
    "decimals": 18
  },
  "networkId": 78430,
  "rpc": [
    "https://amplify-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://78430.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/amplify/testnet/rpc"
  ],
  "shortName": "amplify",
  "slug": "amplify-subnet",
  "testnet": true
} as const satisfies Chain;