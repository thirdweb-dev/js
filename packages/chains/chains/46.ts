import type { Chain } from "../src/types";
export default {
  "chain": "darwinia",
  "chainId": 46,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://darwinia.subscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://darwinia.network/",
  "name": "Darwinia Network",
  "nativeCurrency": {
    "name": "Darwinia Network Native Token",
    "symbol": "RING",
    "decimals": 18
  },
  "networkId": 46,
  "rpc": [
    "https://darwinia-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://46.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.darwinia.network",
    "https://darwinia-rpc.darwiniacommunitydao.xyz",
    "https://darwinia-rpc.dwellir.com"
  ],
  "shortName": "darwinia",
  "slug": "darwinia-network",
  "testnet": false
} as const satisfies Chain;