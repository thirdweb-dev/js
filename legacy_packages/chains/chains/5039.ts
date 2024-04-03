import type { Chain } from "../src/types";
export default {
  "chain": "ONIGIRI",
  "chainId": 5039,
  "explorers": [
    {
      "name": "ONIGIRI Explorer",
      "url": "https://subnets-test.avax.network/onigiri",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.ongr.org/",
  "name": "ONIGIRI Test Subnet",
  "nativeCurrency": {
    "name": "ONIGIRI",
    "symbol": "ONGR",
    "decimals": 18
  },
  "networkId": 5039,
  "rpc": [
    "https://5039.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/onigiri/testnet/rpc"
  ],
  "shortName": "onigiri",
  "slug": "onigiri-test-subnet",
  "testnet": true
} as const satisfies Chain;