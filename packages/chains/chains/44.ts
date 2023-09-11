import type { Chain } from "../src/types";
export default {
  "name": "Crab Network",
  "chain": "crab",
  "rpc": [
    "https://crab-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://crab-rpc.darwinia.network",
    "https://crab-rpc.darwiniacommunitydao.xyz",
    "https://crab.api.onfinality.io/public-ws",
    "https://darwiniacrab-rpc.dwellir.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Crab Network Native Token",
    "symbol": "CRAB",
    "decimals": 18
  },
  "infoURL": "https://crab.network/",
  "shortName": "crab",
  "chainId": 44,
  "networkId": 44,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://crab.subscan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "crab-network"
} as const satisfies Chain;