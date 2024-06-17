import type { Chain } from "../src/types";
export default {
  "chain": "crab",
  "chainId": 44,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://crab-scan.darwinia.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://crab.network/",
  "name": "Crab Network",
  "nativeCurrency": {
    "name": "Crab Network Native Token",
    "symbol": "CRAB",
    "decimals": 18
  },
  "networkId": 44,
  "rpc": [
    "https://44.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://crab-rpc.darwinia.network",
    "https://crab-rpc.darwiniacommunitydao.xyz"
  ],
  "shortName": "crab",
  "slug": "crab-network",
  "testnet": false
} as const satisfies Chain;