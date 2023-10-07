import type { Chain } from "../src/types";
export default {
  "chain": "GearZero",
  "chainId": 266256,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://token.gearzero.ca/testnet",
  "name": "Gear Zero Network Testnet",
  "nativeCurrency": {
    "name": "Gear Zero Network Native Token",
    "symbol": "GZN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gear-zero-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gzn-test.linksme.info"
  ],
  "shortName": "gz-testnet",
  "slug": "gear-zero-network-testnet",
  "testnet": true
} as const satisfies Chain;