import type { Chain } from "../src/types";
export default {
  "chain": "crab",
  "chainId": 44,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://crab.subscan.io",
      "standard": "none"
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
    "https://crab-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://44.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://crab-rpc.darwinia.network",
    "https://crab-rpc.darwiniacommunitydao.xyz",
    "https://darwiniacrab-rpc.dwellir.com"
  ],
  "shortName": "crab",
  "slug": "crab-network",
  "testnet": false
} as const satisfies Chain;