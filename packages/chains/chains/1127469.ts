import type { Chain } from "../src/types";
export default {
  "chain": "TILTYARD",
  "chainId": 1127469,
  "explorers": [
    {
      "name": "TILTYARD Explorer",
      "url": "http://testnet-explorer.tiltyard.gg",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "name": "Tiltyard Subnet",
  "nativeCurrency": {
    "name": "Tiltyard Token",
    "symbol": "TILTG",
    "decimals": 18
  },
  "networkId": 1127469,
  "rpc": [
    "https://1127469.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/tiltyard/testnet/rpc"
  ],
  "shortName": "tiltyard",
  "slug": "tiltyard-subnet",
  "testnet": true
} as const satisfies Chain;