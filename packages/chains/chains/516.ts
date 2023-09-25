import type { Chain } from "../src/types";
export default {
  "chainId": 516,
  "chain": "GearZero",
  "name": "Gear Zero Network Mainnet",
  "rpc": [
    "https://gear-zero-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gzn.linksme.info"
  ],
  "slug": "gear-zero-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Gear Zero Network Native Token",
    "symbol": "GZN",
    "decimals": 18
  },
  "infoURL": "https://token.gearzero.ca/mainnet",
  "shortName": "gz-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;