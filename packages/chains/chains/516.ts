import type { Chain } from "../src/types";
export default {
  "chain": "GearZero",
  "chainId": 516,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://token.gearzero.ca/mainnet",
  "name": "Gear Zero Network Mainnet",
  "nativeCurrency": {
    "name": "Gear Zero Network Native Token",
    "symbol": "GZN",
    "decimals": 18
  },
  "networkId": 516,
  "rpc": [
    "https://516.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gzn.linksme.info"
  ],
  "shortName": "gz-mainnet",
  "slip44": 516,
  "slug": "gear-zero-network",
  "testnet": false
} as const satisfies Chain;