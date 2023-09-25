import type { Chain } from "../src/types";
export default {
  "chainId": 266256,
  "chain": "GearZero",
  "name": "Gear Zero Network Testnet",
  "rpc": [
    "https://gear-zero-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gzn-test.linksme.info"
  ],
  "slug": "gear-zero-network-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Gear Zero Network Native Token",
    "symbol": "GZN",
    "decimals": 18
  },
  "infoURL": "https://token.gearzero.ca/testnet",
  "shortName": "gz-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;